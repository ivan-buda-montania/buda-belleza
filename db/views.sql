-- Cleaned, English-named views over the raw eleventa mirror.
-- Applied by scripts/db/import-eleventa.ts after every import; the raw_* tables keep the
-- POS's own names and values (CHAR padding trimmed, float noise dropped, passwords excluded).

CREATE INDEX idx_raw_productos_codigo ON raw_productos (codigo);
CREATE INDEX idx_raw_historial_inventario_producto ON raw_historial_inventario (codigo_producto);
CREATE INDEX idx_raw_historial_inventario_cuando ON raw_historial_inventario (cuando_fue);

CREATE VIEW departments AS
SELECT
  id,
  nombre AS name,
  activo = '1' AS active
FROM raw_departamentos;

-- stock = -1 means eleventa is not tracking inventory for that product.
CREATE VIEW products AS
SELECT
  p.codigo AS code,
  TRIM(p.descripcion) AS name,
  ROUND(p.pcosto, 2) AS cost,
  ROUND(p.pventa, 2) AS price,
  ROUND(p.mayoreo, 2) AS wholesale_price,
  p.dept AS department_id,
  d.nombre AS department,
  p.tventa AS sale_type,
  p.dinventario AS stock,
  p.dinvminimo AS stock_min,
  p.checado_en AS last_checked_on
FROM raw_productos p
LEFT JOIN raw_departamentos d ON d.id = p.dept;

-- product_name is NULL when the product has since been deleted from the catalog.
CREATE VIEW inventory_movements AS
SELECT
  h.id,
  h.cuando_fue AS occurred_at,
  h.tipo AS type,
  h.habia AS qty_before,
  h.cantidad AS quantity,
  h.codigo_producto AS product_code,
  TRIM(p.descripcion) AS product_name,
  h.usuario_id AS user_id,
  h.caja_id AS register_id
FROM raw_historial_inventario h
LEFT JOIN raw_productos p ON p.codigo = h.codigo_producto;
