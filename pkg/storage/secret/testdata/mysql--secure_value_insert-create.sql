INSERT INTO `secure_value` (
    "uid", 
    "namespace", "name", "title",
    "manager", "path",
    "scheme", "salt", "encrypted_value", "encrypted_time",
    "created", "created_by",
    "updated", "updated_by",
    "annotations", "labels", 
    "apis"
  )
  VALUES (
    'abc',
    'ns', 'name', 'title',
    'default', 'path',
    'Scheme', 'TheSalt', 'EncryptedValue', 5678,
    1234, 'user:ryan',
    5678, 'user:cameron',
    '{"x":"XXXX"}', '{"a":"AAA", "b", "BBBB"}',
    '["aaa", "bbb", "ccc"]'
  )
;
