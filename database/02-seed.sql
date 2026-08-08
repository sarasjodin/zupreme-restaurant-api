-- Zupreme database seed
-- Inserts required initial data after the schema has been created

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE zupreme_restaurant;

-- -----------------------------------------------------
-- Menu categories
-- -----------------------------------------------------

INSERT INTO menu_categories (
    name,
    sort_order
)
VALUES
    ('Förrätter', 1),
    ('Soppor', 2),
    ('Varmrätter', 3),
    ('Efterrätter', 4),
    ('Drycker', 5)
ON DUPLICATE KEY UPDATE
    sort_order = VALUES(sort_order);

-- -----------------------------------------------------
-- Menu items
-- -----------------------------------------------------

INSERT INTO menu_items (
    category_id,
    name,
    description,
    serving,
    price,
    is_available,
    sort_order
)
VALUES
(
    2,
    'Krämig tomatsoppa',
    'Tomat • Basilika • Grädde • Vitlök',
    'Portion',
    165.00,
    TRUE,
    1
),
(
    4,
    'Crème brûlée',
    'Grädde • Rörsocker • Vanilj • Äggula',
    'Portion',
    145.00,
    FALSE,
    1
),
(
    5,
    'Husets röda vin',
    'Cabernet Sauvignon • Merlot',
    'Glas 15 cl',
    125.00,
    TRUE,
    2
),
(
    5,
    'Evian kolsyrat vatten',
    'Vatten från franska Alperna',
    'Flaska 0,75 l',
    20.00,
    TRUE,
    1
),
(
    1,
    'Burrata med tomat & basilika',
    'Burrata • Tomat • Basilika • Olivolja',
    'Portion',
    165.00,
    TRUE,
    1
),
(
    3,
    'Grillad oxfilé med rödvinssås',
    'Oxfilé • Rödvinssås • Potatis • Grönsaker',
    'Portion',
    365.00,
    TRUE,
    1
)
ON DUPLICATE KEY UPDATE
    category_id = VALUES(category_id),
    description = VALUES(description),
    serving = VALUES(serving),
    price = VALUES(price),
    is_available = VALUES(is_available),
    sort_order = VALUES(sort_order);

-- -----------------------------------------------------
-- Messages
-- -----------------------------------------------------

INSERT INTO messages (
    name,
    email,
    subject,
    message,
    status
)
VALUES
(
    'Anna Test',
    'anna@example.com',
    'Fråga om meny',
    'Hej, vad har ni för vegetariska alternativ?',
    'unread'
),
(
    'Anna Test2',
    'anna2@example.com',
    'Allergier',
    'Har ni glutenfria alternativ?',
    'read'
);
