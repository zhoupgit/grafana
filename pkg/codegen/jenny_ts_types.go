package codegen

import (
	"context"

	"cuelang.org/go/cue"
	"github.com/grafana/codejen"
	"github.com/grafana/cog"
)

// TSTypesJenny is a [OneToOne] that produces TypeScript types and defaults.
type TSTypesJenny struct{}

var _ codejen.OneToOne[SchemaForGen] = &TSTypesJenny{}

func (j TSTypesJenny) JennyName() string {
	return "TSTypesJenny"
}

func (j TSTypesJenny) Generate(sfg SchemaForGen) (*codejen.File, error) {
	cueOptions := make([]cog.CUEOption, 0)
	if sfg.IsGroup {
		// cueOptions = append(cueOptions, cog.ForceEnvelope(sfg.Name))
	}

	b, err := cog.
		TypesFromSchema().
		Typescript().
		CUEValue(sfg.Name, sfg.CueFile.LookupPath(cue.ParsePath("lineage.schemas[0].schema")), cueOptions...).
		Run(context.Background())
	if err != nil {
		return nil, err
	}

	outputName := sfg.Name
	if sfg.OutputName != "" {
		outputName = sfg.OutputName
	}

	return codejen.NewFile(outputName+"_types.gen.ts", b, j), nil
}
