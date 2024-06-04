import { DataSourceInstanceSettings, ScopedVars } from '@grafana/data';
import { LanguageDefinition } from '@grafana/experimental';
import { TemplateSrv } from '@grafana/runtime';
import { SqlDatasource, DB, SQLQuery, SQLSelectableValue, formatSQL } from '@grafana/sql';

import { PostgresQueryModel } from './PostgresQueryModel';
import { getSchema, getTimescaleDBVersion, getVersion, showTables } from './postgresMetaQuery';
import { fetchColumns, fetchTables, getSqlCompletionProvider } from './sqlCompletionProvider';
import { getFieldConfig, toRawSql } from './sqlUtil';
import { PostgresOptions } from './types';

export class PostgresDatasource extends SqlDatasource {
  sqlLanguageDefinition: LanguageDefinition | undefined = undefined;

  constructor(instanceSettings: DataSourceInstanceSettings<PostgresOptions>) {
    super(instanceSettings);
  }

  getQueryModel(target?: SQLQuery, templateSrv?: TemplateSrv, scopedVars?: ScopedVars): PostgresQueryModel {
    return new PostgresQueryModel(target, templateSrv, scopedVars);
  }

  async getVersion(): Promise<string> {
    const value = await this.runSql<{ version: number }>(getVersion());
    const results = value.fields.version?.values;

    if (!results) {
      return '';
    }

    return results[0].toString();
  }

  async getTimescaleDBVersion(): Promise<string | undefined> {
    const value = await this.runSql<{ extversion: string }>(getTimescaleDBVersion());
    const results = value.fields.extversion?.values;

    if (!results) {
      return undefined;
    }

    return results[0];
  }

  async fetchTables(): Promise<string[]> {
    const tables = await this.runSql<{ table: string[] }>(showTables(), { refId: 'tables' });
    return tables.fields.table?.values.flat() ?? [];
  }

  getSqlLanguageDefinition(db: DB): LanguageDefinition {
    if (this.sqlLanguageDefinition !== undefined) {
      return this.sqlLanguageDefinition;
    }

    const args = {
      getColumns: { current: (query: SQLQuery) => fetchColumns(db, query) },
      getTables: { current: () => fetchTables(db) },
    };
    this.sqlLanguageDefinition = {
      id: 'pgsql',
      completionProvider: getSqlCompletionProvider(args),
      formatter: formatSQL,
    };
    return this.sqlLanguageDefinition;
  }

  async fetchFields(query: SQLQuery): Promise<SQLSelectableValue[]> {
    const { table } = query;
    if (table === undefined) {
      // if no table-name, we are not able to query for fields
      return [];
    }
    const schema = await this.runSql<{ column: string; type: string }>(getSchema(table), { refId: 'columns' });
    const result: SQLSelectableValue[] = [];
    for (let i = 0; i < schema.length; i++) {
      const column = schema.fields.column.values[i];
      const type = schema.fields.type.values[i];
      result.push({ label: column, value: column, type, ...getFieldConfig(type) });
    }
    return result;
  }

  getDB(): DB {
    if (this.db !== undefined) {
      return this.db;
    }

    return {
      init: () => Promise.resolve(true),
      datasets: () => Promise.resolve([]),
      tables: () => this.fetchTables(),
      getEditorLanguageDefinition: () => this.getSqlLanguageDefinition(this.db),
      fields: async (query: SQLQuery) => {
        if (!query?.table) {
          return [];
        }
        return this.fetchFields(query);
      },
      validateQuery: (query) =>
        Promise.resolve({ isError: false, isValid: true, query, error: '', rawSql: query.rawSql }),
      dsID: () => this.id,
      toRawSql,
      functions: () => [
        '$__time',
        '$__timeEpoch',
        '$__unixEpochNanoFrom',
        '$__unixEpochNanoTo',
        '$__unixEpochGroup',
        '$__unixEpochGroupAlias',
      ],
      lookup: async () => {
        const tables = await this.fetchTables();
        return tables.map((t) => ({ name: t, completion: t }));
      },
    };
  }
}
