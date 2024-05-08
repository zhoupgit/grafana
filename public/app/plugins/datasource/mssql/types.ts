import { SQLOptions } from 'app/features/plugins/sql/types';

export enum MSSQLAuthenticationType {
  sqlAuth = 'SQL Server Authentication',
  windowsAuth = 'Windows Authentication',
  kerberosRaw = 'Windows AD: Username + password',
  kerberosKeytab = 'Windows AD: Keytab',
  kerberosCredentialCache = 'Windows AD: Credential cache',
  kerberosCredentialCacheLookupFile = 'Windows AD: Credential cache file',
}

export enum MSSQLEncryptOptions {
  disable = 'disable',
  false = 'false',
  true = 'true',
}
export interface MssqlOptions extends SQLOptions {
  authenticationType?: MSSQLAuthenticationType;
  encrypt?: MSSQLEncryptOptions;
  sslRootCertFile?: string;
  serverName?: string;
  connectionTimeout?: number;
  keytabFilePath?: string;
  credentialCache?: string;
  credentialCacheLookupFile?: string;
  configFilePath?: string;
  UDPConnectionLimit?: number;
  enableDNSLookupKDC?: string;
}
