package ualert

import "github.com/grafana/grafana/pkg/services/sqlstore/migrator"

func AddRecordingRuleColumns(mg *migrator.Migrator) {
	mg.AddMigration("add record column to alert_rule table", migrator.NewAddColumnMigration(migrator.Table{Name: "alert_rule"}, &migrator.Column{
		Name:     "record",
		Type:     migrator.DB_NVarchar,
		Length:   DefaultFieldMaxLength,
		Nullable: false,
	}))

	mg.AddMigration("add record_from column to alert_rule table", migrator.NewAddColumnMigration(migrator.Table{Name: "alert_rule"}, &migrator.Column{
		Name:     "record_from",
		Type:     migrator.DB_NVarchar,
		Length:   DefaultFieldMaxLength,
		Nullable: false,
	}))

	mg.AddMigration("add record_to column to alert_rule table", migrator.NewAddColumnMigration(migrator.Table{Name: "alert_rule"}, &migrator.Column{
		Name:     "record_to",
		Type:     migrator.DB_Text, // Text, to allow for future growth, as this contains a JSON-ified struct.
		Nullable: true,
	}))
}
