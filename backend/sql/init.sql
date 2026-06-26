-- USERS
CREATE TABLE IF NOT EXISTS users (
    id                BIGSERIAL       PRIMARY KEY,
    email             VARCHAR(255)    NOT NULL UNIQUE,
    password_hash     VARCHAR(255)    NOT NULL,
    first_name        VARCHAR(100),
    last_name         VARCHAR(100),
    phone_number      VARCHAR(20),
    city              VARCHAR(100),
    state             VARCHAR(100),
    profile_photo_url VARCHAR(255),
    bio               TEXT,
    created_at        TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP
);

-- ITEMS
CREATE TABLE IF NOT EXISTS items (
    id          SERIAL          PRIMARY KEY,
    title       VARCHAR(255)   NOT NULL,
    description TEXT,
    image_url   VARCHAR(255),
    category    VARCHAR(100),
    price       NUMERIC(10,2),
    size        VARCHAR(10),
    gender      VARCHAR(10)   CHECK (gender IN ('Men', 'Women', 'Unisex')),
    condition   VARCHAR(50),
    owner_id    BIGINT         REFERENCES users(id),
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_owner_id ON items(owner_id);

-- SAVED_ITEMS
CREATE TABLE IF NOT EXISTS saved_items (
    id         SERIAL       PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id),
    item_id    INTEGER     NOT NULL REFERENCES items(id),
    created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id);

-- SWIPES
CREATE TABLE IF NOT EXISTS swipes (
    id         BIGSERIAL    PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id),
    item_id    BIGINT       NOT NULL REFERENCES items(id),
    action     TEXT         NOT NULL CHECK (action IN ('liked', 'passed')),
    created_at TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_swipes_user_action ON swipes(user_id, action);