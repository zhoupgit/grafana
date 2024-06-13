package setting

import "slices"

type ZanzanaMode string

const (
	ZanzanaModeEmbedded   = "embedded"
	ZanzanaModeStandalone = "standalone"
)

type ZanzanaSettings struct {
	// Mode can either be embedded or standalone
	Mode ZanzanaMode
}

func (c *Cfg) readZanzanaSettings() {
	s := ZanzanaSettings{}

	sec := c.Raw.Section("zanzana")
	s.Mode = ZanzanaMode(sec.Key("mode").MustString("embedded"))

	validModes := []ZanzanaMode{"embedded", "standalone"}

	if slices.Contains(validModes, s.Mode) {
		c.Logger.Warn("Invalid zanzana mode. It can be any of %v but got %s", validModes, s.Mode)
		s.Mode = "embedded"
	}
}
