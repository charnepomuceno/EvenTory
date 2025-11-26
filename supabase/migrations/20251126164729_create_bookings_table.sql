/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key) - Unique booking identifier
      - `user_id` (text) - Reference to the user who made the booking
      - `full_name` (text) - Customer's full name
      - `email` (text) - Customer's email
      - `phone` (text) - Customer's phone number
      - `event_type` (text) - Type of event (wedding, birthday, etc.)
      - `number_of_guests` (integer) - Number of expected guests
      - `event_date` (text) - Date of the event
      - `event_location` (text) - Location of the event
      - `preferred_package` (text) - Selected package name
      - `special_requests` (text, nullable) - Additional requests or notes
      - `status` (text) - Booking status: pending, confirmed, completed, cancelled
      - `price` (text, nullable) - Total price for the booking
      - `paid` (text, nullable) - Amount paid so far
      - `created_at` (timestamptz) - When booking was created
      - `updated_at` (timestamptz) - When booking was last updated

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for users to view their own bookings
    - Add policy for users to create their own bookings
    - Add policy for users to update their own bookings (for cancellation)
    - Admin users will need direct database access or service role for full access
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  event_type text NOT NULL,
  number_of_guests integer NOT NULL,
  event_date text NOT NULL,
  event_location text NOT NULL,
  preferred_package text NOT NULL,
  special_requests text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  price text DEFAULT '0',
  paid text DEFAULT '0',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);