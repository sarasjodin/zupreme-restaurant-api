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
    image_path,
    serving,
    price,
    is_available,
    sort_order
)
VALUES

-- Förrätter
(
    1,
    'Burrata med tomat & basilika',
    'Burrata • Tomat • Basilika • Olivolja',
    '/images/menu-items/burrata-med-tomat-och-basilika.webp',
    'Portion',
    165.00,
    TRUE,
    1
),
(
    1,
    'Chèvre chaud med päron & valnöt',
    'Chèvre • Päron • Valnöt • Honung • Timjan',
    '/images/menu-items/chevre-chaud-med-paron-och-valnot.webp',
    'Portion',
    155.00,
    TRUE,
    2
),
(
    1,
    'Toast Skagen à la Zuprême',
    'Räkor • Dill • Citron • Brioche • Löjrom',
    '/images/menu-items/toast-skagen-a-la-zupreme.webp',
    'Portion',
    175.00,
    TRUE,
    3
),

-- Soppor
(
    2,
    'Tomatsoppa',
    'Tomat • Grädde • Basilika • Vitlök',
    '/images/menu-items/kramig-tomatsoppa.webp',
    'Portion',
    165.00,
    TRUE,
    1
),
(
    2,
    'Soupe à l’oignon gratinée',
    'Gul lök • Oxbuljong • Gruyère • Timjan • Surdegsbröd',
    '/images/menu-items/soupe-a-loignon-gratinee.webp',
    'Skål',
    175.00,
    TRUE,
    2
),
(
    2,
    'Krämig kantarellsoppa',
    'Kantareller • Grädde • Schalottenlök • Timjan • Brynt smör',
    '/images/menu-items/kramig-kantarellsoppa.webp',
    'Skål',
    185.00,
    TRUE,
    3
),
(
    2,
    'Tom kha gai',
    'Kyckling • Kokosmjölk • Citrongräs • Lime • Chili • Koriander',
    '/images/menu-items/tom-kha-gai.webp',
    'Skål',
    185.00,
    TRUE,
    4
),

-- Varmrätter
(
    3,
    'Bouillabaisse Zuprême',
    'Fisk • Räkor • Musslor • Tomat • Saffran • Rouille',
    '/images/menu-items/bouillabaisse-zupreme.webp',
    'Stor skål',
    295.00,
    TRUE,
    1
),
(
    3,
    'Phở bò',
    'Nötkött • Risnudlar • Ingefära • Stjärnanis • Lime • Örter',
    '/images/menu-items/pho-bo.webp',
    'Stor skål',
    245.00,
    TRUE,
    2
),
(
    3,
    'Grillad oxfilé med rödvinssås',
    'Oxfilé • Rödvinssås • Potatis • Grönsaker',
    '/images/menu-items/grillad-oxfile-med-rodvinssas.webp',
    'Portion',
    365.00,
    TRUE,
    3
),
(
    3,
    'Confit de canard',
    'Anklår • Potatis • Haricots verts • Apelsin • Rödvinssky',
    '/images/menu-items/confit-de-canard.webp',
    'Portion',
    345.00,
    TRUE,
    4
),
(
    3,
    'Risotto ai funghi',
    'Arborioris • Karljohanssvamp • Parmesan • Vitt vin • Timjan',
    '/images/menu-items/risotto-ai-funghi.webp',
    'Portion',
    255.00,
    TRUE,
    5
),

-- Efterrätter
(
    4,
    'Tarte Tatin',
    'Karamelliserat äpple • Smördeg • Vanilj • Crème fraîche',
    '/images/menu-items/tarte-tatin.webp',
    'Portion',
    155.00,
    TRUE,
    1
),
(
    4,
    'Hjortron & vanilj',
    'Hjortron • Vaniljkräm • Havrecrumble • Vit choklad',
    '/images/menu-items/hjortron-och-vanilj.webp',
    'Portion',
    145.00,
    TRUE,
    2
),
(
    4,
    'Chokladmousse med hallon',
    'Chokladmousse • Hallon',
    '/images/menu-items/chokladmousse-med-hallon.webp',
    'Portion',
    145.00,
    TRUE,
    3
),
(
    4,
    'Crème brûlée',
    'Grädde • Rörsocker • Vanilj • Äggula',
    '/images/menu-items/creme-brulee.webp',
    'Portion',
    145.00,
    FALSE,
    4
),

-- Drycker
(
    5,
    'Yuzu & fläder spritz',
    'Yuzu • Fläder • Citrus • Sodavatten • Rosmarin • 25 cl',
    '/images/menu-items/yuzu-och-flader-spritz.webp',
    'Glas',
    95.00,
    TRUE,
    1
),
(
    5,
    'Evian kolsyrat vatten',
    'Mineralvatten från franska Alperna • Kolsyrat • 0,75 l',
    '/images/menu-items/evian-kolsyrat-vatten.webp',
    'Flaska',
    25.00,
    TRUE,
    2
),
(
    5,
    'Husets röda vin',
    'Rött vin • 15 cl • Cabernet Sauvignon • Merlot',
    '/images/menu-items/husets-roda-vin.webp',
    'Glas',
    125.00,
    TRUE,
    3
)

ON DUPLICATE KEY UPDATE
    category_id = VALUES(category_id),
    description = VALUES(description),
    image_path = VALUES(image_path),
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
