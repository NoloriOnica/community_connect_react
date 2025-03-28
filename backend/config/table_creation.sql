CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    otp_code VARCHAR(6),             -- For storing OTP temporarily
    otp_expires_at TIMESTAMP,        -- For OTP expiration check
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN latitude NUMERIC,
ADD COLUMN longitude NUMERIC;

CREATE TABLE user_stats (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_listings_posted INTEGER DEFAULT 0,
    total_requests_posted INTEGER DEFAULT 0,
    listings_fulfilled INTEGER DEFAULT 0,     -- listings by others fulfilled by this user
    requests_fulfilled INTEGER DEFAULT 0,     -- requests by others fulfilled by this user
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    image_path VARCHAR(255) NOT NULL,                -- Local path to the uploaded image
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,                       -- e.g., Books, Food, Furniture, etc.
    expiry_date DATE,                                -- Nullable if not applicable
    allergy TEXT,                                    -- Nullable if not applicable
    status VARCHAR(20) DEFAULT 'available',          -- 'available', 'reserved', 'pending completion', 'completed'
    reserved_by INTEGER REFERENCES users(id),        -- User who reserved the listing (nullable)
    completed_by INTEGER REFERENCES users(id),       -- User who completed the listing (nullable)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE listings
ADD COLUMN approved SMALLINT DEFAULT 0;


CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    subject VARCHAR(255) NOT NULL,
    request_date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(255),                         -- Optional image for the request
    status VARCHAR(20) DEFAULT 'open',               -- 'open', 'reserved', or 'completed'
    reserved_by INTEGER REFERENCES users(id),        -- User who reserved the request (nullable)
    completed_by INTEGER REFERENCES users(id),       -- User who completed the request (nullable)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE requests
ADD COLUMN approved SMALLINT DEFAULT 0;



INSERT INTO listings (user_id, image_path, item_name, description, type, expiry_date, allergy, status)
VALUES
  (2, 'uploads/sample1.jpg', 'Free Books', 'A collection of gently used books available for free.', 'Books', '2025-05-01', NULL, 'available'),
  (2, 'uploads/sample2.jpg', 'Chair Giveaway', 'Comfortable chairs perfect for community events.', 'Furniture', NULL, NULL, 'available'),
  (2, 'uploads/sample3.jpg', 'Vintage Record Player', 'An old-school record player in working condition.', 'Electronics', '2025-06-15', NULL, 'available');

INSERT INTO listings (user_id, image_path, item_name, description, type, expiry_date, allergy, status)
VALUES
  (2, 'uploads/chocolates.jpg', 'Organic Apples', 'Freshly picked organic apples from a local farm.', 'Food', '2025-04-30', 'None', 'available'),
  (2, 'uploads/chocolates.jpg', 'Childrens Winter Jackets', 'Warm jackets for kids, sizes range from 5-10 years.', 'Clothes', NULL, NULL, 'reserved'),
  (2, 'uploads/chocolates.jpg', 'Old Laptop', 'Works fine, just a bit slow. Good for basic tasks.', 'Electronics', NULL, NULL, 'available'),
  (2, 'uploads/chocolates.jpg', 'Canned Goods Pack', 'Includes canned beans, tomatoes, and corn. Not expired.', 'Food', '2025-08-10', 'Soy', 'completed'),
  (2, 'uploads/chocolates.jpg', 'Story Books for Kids', 'A collection of bedtime stories for children aged 4-8.', 'Books', NULL, NULL, 'available'),
  (2, 'uploads/chocolates.jpg', 'Reusable Water Bottles', 'Set of 3 eco-friendly reusable bottles.', 'Home Items', NULL, NULL, 'reserved'),
  (2, 'uploads/chocolates.jpg', 'Homemade Cookies', 'Freshly baked cookies in different flavors.', 'Food', '2025-04-01', 'Gluten', 'available');



INSERT INTO requests (user_id, subject, request_date, venue, description, image_path, status)
VALUES
  (2, 'Help with Moving Sofa', '2025-04-15', '123 Community Center', 'Need assistance to move a heavy sofa at my place.', 'uploads/request1.jpg', 'open'),
  (2, 'Math Tutor Needed', '2025-04-20', '456 Community Center', 'Looking for a math tutor for high school level.', NULL, 'open'),
  (2, 'Gardening Assistance', '2025-05-05', '789 Community Center', 'Need help with seasonal garden maintenance.', 'uploads/request3.jpg', 'open');

INSERT INTO users (
  id, username, password_hash, email, phone, postal_code, is_verified
) VALUES (
  4, 'tampines_user', 'hashed_password_here', 'tampines@example.com', '98765432', '520201', TRUE
);
INSERT INTO listings (
  user_id, image_path, item_name, description, type, expiry_date, allergy
) VALUES
-- Listing 1
(4, 'uploads/chocolates.jpg', 'Dining Table Set', 'Used wooden dining table, seats 4.', 'Furniture', '2025-04-15', NULL),

-- Listing 2
(4, 'uploads/chocolates.jpg', 'Children Books Bundle', '10 storybooks for kids aged 6–9.', 'Books', NULL, NULL),

-- Listing 3
(4, 'uploads/chocolates.jpg', 'Surplus Rice Packets', '5kg unopened rice packets, halal-certified.', 'Food', '2025-03-30', 'None');

CREATE TABLE user_stats (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_listings_posted INTEGER DEFAULT 0,
    total_requests_posted INTEGER DEFAULT 0,
    listings_fulfilled INTEGER DEFAULT 0,     -- listings by others fulfilled by this user
    requests_fulfilled INTEGER DEFAULT 0,     -- requests by others fulfilled by this user
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
