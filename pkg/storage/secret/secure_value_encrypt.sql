UPDATE {{ .Ident "secure_value" }} SET 
 "scheme"={{ .Arg .Encrypted.Scheme }}, 
 "salt"={{ .Arg .Encrypted.Salt }}, 
 "encrypted_value"={{ .Arg .Encrypted.Value }}, 
 "encrypted_time"={{ .Arg .Timestamp }}, 
WHERE "uid"={{ .Arg .UID }}