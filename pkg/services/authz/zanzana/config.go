package zanzana

import "time"

type Config struct {
	DB DBConfig

	// Limit for the ListObjects result
	ListObjectsMaxResults uint32
	// Deadline for ListObjects request
	ListObjectsDeadline time.Duration
	// Limit of datastore reads that can be in flight for a given Check call
	MaxConcurrentReadsForCheck uint32
	// Limits the resolution depth of a single query
	ResolveNodeLimit uint32
	// limits the resolution breadth.
	ResolveNodeBreadthLimit uint32
}

type DBConfig struct {
	Engine string
	UIR    string

	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxIdleTime time.Duration
	ConnMaxLifetime time.Duration
}
