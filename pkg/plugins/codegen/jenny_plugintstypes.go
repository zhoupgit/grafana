package codegen

import (
	"fmt"
	"os"
	"path"
	"path/filepath"
	"strings"

	"cuelang.org/go/cue"
	"github.com/grafana/codejen"
	"github.com/grafana/grafana/pkg/codegen"
	"github.com/grafana/grafana/pkg/plugins/pfs"
)

var versionedPluginPath = filepath.Join("packages", "grafana-schema", "src", "raw", "composable")

func PluginTSTypesJenny(root string) codejen.OneToMany[*pfs.PluginDecl] {
	return &ptsJenny{
		root:  root,
		inner: adaptToPipeline(codegen.TSTypesJenny{}),
	}
}

type ptsJenny struct {
	root  string
	inner codejen.OneToOne[*pfs.PluginDecl]
}

func (j *ptsJenny) JennyName() string {
	return "PluginTsTypesJenny"
}

func (j *ptsJenny) Generate(decl *pfs.PluginDecl) (codejen.Files, error) {
	schemaVersionPath := cue.ParsePath("lineage.schemas[0].schema.pluginVersion")
	decl.CueFile = decl.CueFile.FillPath(schemaVersionPath, getPluginVersion(decl.PluginMeta.Version))

	jf, err := j.inner.Generate(decl)
	if err != nil {
		return nil, err
	}

	genPath := filepath.Join(j.root, decl.PluginPath, fmt.Sprintf("%s.gen.ts", strings.ToLower(decl.SchemaInterface.Name)))
	files := make(codejen.Files, 2)
	files[0] = *codejen.NewFile(genPath, jf.Data, append(jf.From, j)...)

	pluginFolder := strings.ReplaceAll(strings.ToLower(decl.PluginMeta.Name), " ", "")
	versionedPath := filepath.Join(versionedPluginPath, pluginFolder, strings.ToLower(decl.SchemaInterface.Name), "x", jf.RelativePath)
	files[1] = *codejen.NewFile(versionedPath, jf.Data, append(jf.From, j)...)

	return files, nil
}

func getPluginVersion(pluginVersion *string) string {
	if pluginVersion != nil {
		return *pluginVersion
	}

	return getGrafanaVersion()
}

func adaptToPipeline(j codejen.OneToOne[codegen.SchemaForGen]) codejen.OneToOne[*pfs.PluginDecl] {
	return codejen.AdaptOneToOne(j, func(pd *pfs.PluginDecl) codegen.SchemaForGen {
		return codegen.SchemaForGen{
			Name:    derivePascalName(pd.PluginMeta.Id, pd.PluginMeta.Name) + pd.SchemaInterface.Name,
			CueFile: pd.CueFile,
			IsGroup: pd.SchemaInterface.IsGroup,
		}
	})
}

func derivePascalName(id string, name string) string {
	sani := func(s string) string {
		ret := strings.Title(strings.Map(func(r rune) rune {
			switch {
			case r >= 'a' && r <= 'z':
				return r
			case r >= 'A' && r <= 'Z':
				return r
			default:
				return -1
			}
		}, strings.Title(strings.Map(func(r rune) rune {
			switch r {
			case '-', '_':
				return ' '
			default:
				return r
			}
		}, s))))
		if len(ret) > 63 {
			return ret[:63]
		}
		return ret
	}

	fromname := sani(name)
	if len(fromname) != 0 {
		return fromname
	}
	return sani(strings.Split(id, "-")[1])
}

func getGrafanaVersion() string {
	dir, err := os.Getwd()
	if err != nil {
		return ""
	}

	pkg, err := OpenPackageJSON(path.Join(dir, "../../../"))
	if err != nil {
		return ""
	}

	return pkg.Version
}
