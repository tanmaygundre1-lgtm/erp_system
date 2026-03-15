-- ============================================================================
-- School Admission CRM System - PostgreSQL Schema
-- ============================================================================
-- This script creates a multi-tenant school admission management system
-- with complete support for schools, students, leads, admissions, and fees.
-- ============================================================================
-- Drop existing tables if they exist (for clean setup)
-- dependencies need to install npm install pg dotenv
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS invoice CASCADE;
DROP TABLE IF EXISTS student_fee_assignment CASCADE;
DROP TABLE IF EXISTS fee_structure CASCADE;
DROP TABLE IF EXISTS admission CASCADE;
DROP TABLE IF EXISTS lead CASCADE;
DROP TABLE IF EXISTS parent_detail CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS school_class CASCADE;
DROP TABLE IF EXISTS academic_year CASCADE;
DROP TABLE IF EXISTS school CASCADE;
-- ============================================================================
-- TABLE 1: SCHOOL (Tenant)
-- ============================================================================
-- Stores information about each school in the multi-tenant system
CREATE TABLE school (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  established_year INT,
  principal_name VARCHAR(150),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  updated_by VARCHAR(100)
);
CREATE INDEX idx_school_name ON school(name);
CREATE INDEX idx_school_status ON school(status);
-- ============================================================================
-- TABLE 2: ACADEMIC_YEAR
-- ============================================================================
-- Stores academic years for the system (e.g., 2023-24, 2024-25)
CREATE TABLE academic_year (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  year_name VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  updated_by VARCHAR(100),
  UNIQUE(school_id, year_name),
  CHECK (end_date >= start_date)
);
CREATE INDEX idx_academic_year_school_id ON academic_year(school_id);
CREATE INDEX idx_academic_year_is_active ON academic_year(is_active);
-- ...existing code...
-- ============================================================================
-- TABLE 3: SCHOOL_CLASS
-- ============================================================================
-- Stores class information (Grade 1, Grade 2, etc.)
CREATE TABLE school_class (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  class_name VARCHAR(100) NOT NULL,
  class_numeric_value INT NOT NULL,
  medium VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(school_id, class_name)
);
CREATE INDEX idx_school_class_school_id ON school_class(school_id);
-- ============================================================================
-- TABLE 4: SECTION
-- ============================================================================
-- Stores sections within a class (A, B, C, etc.)
CREATE TABLE section (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  class_id BIGINT NOT NULL REFERENCES school_class(id) ON DELETE CASCADE,
  section_name VARCHAR(50) NOT NULL,
  capacity INT DEFAULT 60,
  class_teacher VARCHAR(150),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, section_name)
);
CREATE INDEX idx_section_school_id ON section(school_id);
CREATE INDEX idx_section_class_id ON section(class_id);
-- ============================================================================
-- TABLE 5: STUDENT
-- ============================================================================
-- Stores student information
CREATE TABLE student (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  admission_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  blood_group VARCHAR(10),
  aadhar_number VARCHAR(20) UNIQUE,
  status VARCHAR(50) DEFAULT 'active' CHECK (
    status IN ('active', 'inactive', 'passed-out', 'suspended')
  ),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100)
);
CREATE INDEX idx_student_school_id ON student(school_id);
CREATE INDEX idx_student_admission_number ON student(admission_number);
CREATE INDEX idx_student_email ON student(email);
CREATE INDEX idx_student_status ON student(status);
-- ============================================================================
-- TABLE 6: PARENT_DETAIL
-- ============================================================================
-- Stores parent/guardian information
CREATE TABLE parent_detail (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  relation VARCHAR(50) NOT NULL CHECK (
    relation IN ('Father', 'Mother', 'Guardian', 'Other')
  ),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  occupation VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  income_range VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_parent_detail_school_id ON parent_detail(school_id);
CREATE INDEX idx_parent_detail_student_id ON parent_detail(student_id);
-- ============================================================================
-- TABLE 7: LEAD
-- ============================================================================
-- Stores prospective student leads (not yet admitted)
CREATE TABLE lead (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  academic_year_id BIGINT NOT NULL REFERENCES academic_year(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  desired_class VARCHAR(100),
  source VARCHAR(100),
  follow_up_status VARCHAR(50) DEFAULT 'pending' CHECK (
    follow_up_status IN (
      'pending',
      'contacted',
      'interested',
      'not-interested',
      'converted',
      'lost'
    )
  ),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_to VARCHAR(100),
  last_contacted_at TIMESTAMP,
  created_by VARCHAR(100)
);
CREATE INDEX idx_lead_school_id ON lead(school_id);
CREATE INDEX idx_lead_academic_year_id ON lead(academic_year_id);
CREATE INDEX idx_lead_follow_up_status ON lead(follow_up_status);
-- ============================================================================
-- TABLE 8: ADMISSION
-- ============================================================================
-- Stores admission records of students
CREATE TABLE admission (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  lead_id BIGINT REFERENCES lead(id) ON DELETE SET NULL,
  academic_year_id BIGINT NOT NULL REFERENCES academic_year(id) ON DELETE CASCADE,
  class_id BIGINT NOT NULL REFERENCES school_class(id) ON DELETE CASCADE,
  section_id BIGINT NOT NULL REFERENCES section(id) ON DELETE CASCADE,
  admission_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (
    status IN ('active', 'on-leave', 'suspended', 'withdrawn', 'draft', 'submitted')
  ),
  admission_type VARCHAR(50) CHECK (admission_type IN ('new', 'transfer', 'regular')),
  registration_number VARCHAR(50) UNIQUE,
  previous_school VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100)
);
CREATE INDEX idx_admission_school_id ON admission(school_id);
CREATE INDEX idx_admission_student_id ON admission(student_id);
CREATE INDEX idx_admission_lead_id ON admission(lead_id);
CREATE INDEX idx_admission_academic_year_id ON admission(academic_year_id);
CREATE INDEX idx_admission_class_id ON admission(class_id);
CREATE INDEX idx_admission_section_id ON admission(section_id);
CREATE INDEX idx_admission_status ON admission(status);
-- ============================================================================
-- TABLE 9: FEE_STRUCTURE
-- ============================================================================
-- Stores fee structure for classes in each academic year
CREATE TABLE fee_structure (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  academic_year_id BIGINT NOT NULL REFERENCES academic_year(id) ON DELETE CASCADE,
  class_id BIGINT NOT NULL REFERENCES school_class(id) ON DELETE CASCADE,
  fee_type VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  due_date DATE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(academic_year_id, class_id, fee_type)
);
CREATE INDEX idx_fee_structure_school_id ON fee_structure(school_id);
CREATE INDEX idx_fee_structure_academic_year_id ON fee_structure(academic_year_id);
CREATE INDEX idx_fee_structure_class_id ON fee_structure(class_id);
-- ============================================================================
-- TABLE 9A: APPLICATION_PROGRESS
-- ============================================================================
-- Tracks completion status of each admission application step
CREATE TABLE application_progress (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admission_id BIGINT NOT NULL UNIQUE REFERENCES admission(id) ON DELETE CASCADE,
  student_info_status VARCHAR(50) DEFAULT 'pending' CHECK (student_info_status IN ('pending', 'completed')),
  parent_info_status VARCHAR(50) DEFAULT 'pending' CHECK (parent_info_status IN ('pending', 'completed')),
  academic_details_status VARCHAR(50) DEFAULT 'pending' CHECK (academic_details_status IN ('pending', 'completed')),
  photos_status VARCHAR(50) DEFAULT 'pending' CHECK (photos_status IN ('pending', 'completed')),
  documents_status VARCHAR(50) DEFAULT 'pending' CHECK (documents_status IN ('pending', 'completed')),
  review_status VARCHAR(50) DEFAULT 'pending' CHECK (review_status IN ('pending', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_application_progress_admission_id ON application_progress(admission_id);
-- ============================================================================
-- TABLE 9B: DOCUMENTS
-- ============================================================================
-- Stores document metadata and file paths for admissions
CREATE TABLE documents (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admission_id BIGINT NOT NULL REFERENCES admission(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL CHECK (
    document_type IN (
      'student_photo',
      'aadhar_card',
      'birth_certificate',
      'transfer_certificate',
      'previous_marksheet',
      'other'
    )
  ),
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  uploaded_by VARCHAR(100),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_documents_admission_id ON documents(admission_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
-- ============================================================================
-- TABLE 10: STUDENT_FEE_ASSIGNMENT
-- ============================================================================
-- Assigns fees to individual students
CREATE TABLE student_fee_assignment (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  admission_id BIGINT NOT NULL REFERENCES admission(id) ON DELETE CASCADE,
  fee_structure_id BIGINT NOT NULL REFERENCES fee_structure(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  due_date DATE,
  concession_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (
    concession_percentage >= 0
    AND concession_percentage <= 100
  ),
  concession_amount DECIMAL(12, 2) DEFAULT 0,
  final_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (
    status IN (
      'pending',
      'partial',
      'completed',
      'overdue',
      'waived'
    )
  ),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(admission_id, fee_structure_id)
);
CREATE INDEX idx_student_fee_assignment_school_id ON student_fee_assignment(school_id);
CREATE INDEX idx_student_fee_assignment_student_id ON student_fee_assignment(student_id);
CREATE INDEX idx_student_fee_assignment_admission_id ON student_fee_assignment(admission_id);
CREATE INDEX idx_student_fee_assignment_status ON student_fee_assignment(status);
-- ============================================================================
-- TABLE 11: INVOICE
-- ============================================================================
-- Generates invoices for fee collection
CREATE TABLE invoice (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  pending_amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'unpaid' CHECK (
    status IN (
      'unpaid',
      'partial',
      'paid',
      'overdue',
      'cancelled'
    )
  ),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100)
);
CREATE INDEX idx_invoice_school_id ON invoice(school_id);
CREATE INDEX idx_invoice_student_id ON invoice(student_id);
CREATE INDEX idx_invoice_status ON invoice(status);
CREATE INDEX idx_invoice_invoice_number ON invoice(invoice_number);
-- ============================================================================
-- TABLE 12: PAYMENT
-- ============================================================================
-- Records individual payment transactions
CREATE TABLE payment (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  school_id BIGINT NOT NULL REFERENCES school(id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  invoice_id BIGINT NOT NULL REFERENCES invoice(id) ON DELETE CASCADE,
  payment_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (
    payment_method IN (
      'cash',
      'check',
      'bank-transfer',
      'card',
      'upi',
      'other'
    )
  ),
  transaction_id VARCHAR(100),
  bank_name VARCHAR(100),
  cheque_number VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending' CHECK (
    status IN ('pending', 'successful', 'failed', 'cancelled')
  ),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  received_by VARCHAR(100)
);
CREATE INDEX idx_payment_school_id ON payment(school_id);
CREATE INDEX idx_payment_student_id ON payment(student_id);
CREATE INDEX idx_payment_invoice_id ON payment(invoice_id);
CREATE INDEX idx_payment_payment_date ON payment(payment_date);
CREATE INDEX idx_payment_status ON payment(status);
-- ============================================================================
-- Insert Sample Data
-- ============================================================================
-- Insert a sample school
INSERT INTO school (
    name,
    email,
    phone,
    address,
    city,
    state,
    postal_code,
    country,
    principal_name,
    status,
    created_by
  )
VALUES (
    'Green Valley School',
    'info@greenvalley.edu',
    '+91-9876543210',
    '123, School Road',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    'Dr. Rajesh Kumar',
    'active',
    'admin'
  );
-- Insert academic years
INSERT INTO academic_year (
    school_id,
    year_name,
    start_date,
    end_date,
    is_active,
    status,
    created_by
  )
VALUES (
    1,
    '2024-25',
    '2024-04-01',
    '2025-03-31',
    TRUE,
    'active',
    'admin'
  );
-- Insert classes
INSERT INTO school_class (
    school_id,
    class_name,
    class_numeric_value,
    medium
  )
VALUES (1, 'Class 1', 1, 'English'),
  (1, 'Class 2', 2, 'English'),
  (1, 'Class 10', 10, 'English');
-- Insert sections
INSERT INTO section (
    school_id,
    class_id,
    section_name,
    capacity,
    class_teacher
  )
VALUES (1, 1, 'A', 45, 'Mrs. Priya Singh'),
  (1, 1, 'B', 45, 'Mrs. Anjali Sharma'),
  (1, 2, 'A', 45, 'Mr. Vikram Patel');
-- Insert a sample student
INSERT INTO student (
    school_id,
    admission_number,
    first_name,
    middle_name,
    last_name,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    city,
    state,
    postal_code,
    country,
    blood_group,
    status,
    created_by
  )
VALUES (
    1,
    'ADM001',
    'Rohan',
    'Kumar',
    'Singh',
    '2015-08-15',
    'Male',
    'rohan@example.com',
    '+91-9123456789',
    '456, Main Street',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    'O+',
    'active',
    'admin'
  );
-- Insert parent details
INSERT INTO parent_detail (
    school_id,
    student_id,
    relation,
    first_name,
    last_name,
    email,
    phone,
    occupation,
    city
  )
VALUES (
    1,
    1,
    'Father',
    'Rajesh',
    'Singh',
    'rajesh@example.com',
    '+91-9123456780',
    'Engineer',
    'Delhi'
  );
-- Insert a sample lead
INSERT INTO lead (
    school_id,
    academic_year_id,
    first_name,
    last_name,
    email,
    phone,
    desired_class,
    source,
    follow_up_status,
    assigned_to,
    created_by
  )
VALUES (
    1,
    1,
    'Arjun',
    'Kapoor',
    'arjun@example.com',
    '+91-9876543211',
    'Class 5',
    'Website',
    'interested',
    'admin',
    'admin'
  );
-- Insert admission record
INSERT INTO admission (
    school_id,
    student_id,
    academic_year_id,
    class_id,
    section_id,
    admission_date,
    status,
    admission_type,
    created_by
  )
VALUES (
    1,
    1,
    1,
    1,
    1,
    '2024-04-10',
    'active',
    'new',
    'admin'
  );
-- Insert fee structure
INSERT INTO fee_structure (
    school_id,
    academic_year_id,
    class_id,
    fee_type,
    amount,
    description
  )
VALUES (
    1,
    1,
    1,
    'Tuition Fee',
    50000,
    'Monthly tuition fee'
  ),
  (
    1,
    1,
    1,
    'Admission Fee',
    5000,
    'One-time admission fee'
  ),
  (
    1,
    1,
    1,
    'Activity Fee',
    2000,
    'Extra-curricular activities'
  );
-- Insert student fee assignment
INSERT INTO student_fee_assignment (
    school_id,
    student_id,
    admission_id,
    fee_structure_id,
    amount,
    due_date,
    concession_percentage,
    concession_amount,
    final_amount,
    status
  )
VALUES (
    1,
    1,
    1,
    1,
    50000,
    '2024-05-10',
    10,
    5000,
    45000,
    'partial'
  ),
  (
    1,
    1,
    1,
    2,
    5000,
    '2024-04-10',
    0,
    0,
    5000,
    'completed'
  );
-- Insert invoice
INSERT INTO invoice (
    school_id,
    student_id,
    invoice_number,
    invoice_date,
    due_date,
    total_amount,
    paid_amount,
    pending_amount,
    status,
    created_by
  )
VALUES (
    1,
    1,
    'INV-001',
    '2024-04-10',
    '2024-05-10',
    50000,
    25000,
    25000,
    'partial',
    'admin'
  );
-- Insert payment record
INSERT INTO payment (
    school_id,
    student_id,
    invoice_id,
    payment_number,
    amount,
    payment_date,
    payment_method,
    transaction_id,
    status,
    received_by
  )
VALUES (
    1,
    1,
    1,
    'PAY-001',
    25000,
    '2024-05-05',
    'bank-transfer',
    'TXN-2024-05-001',
    'successful',
    'admin'
  );
-- ============================================================================
-- Create Views (Optional but useful for reporting)
-- ============================================================================
-- View: Student with current class and section
CREATE VIEW student_enrollment_view AS
SELECT s.id,
  s.admission_number,
  CONCAT(s.first_name, ' ', s.last_name) as student_name,
  sc.class_name,
  sec.section_name,
  a.admission_date,
  a.status as admission_status,
  sh.name as school_name
FROM student s
  JOIN admission a ON s.id = a.student_id
  JOIN school_class sc ON a.class_id = sc.id
  JOIN section sec ON a.section_id = sec.id
  JOIN school sh ON s.school_id = sh.id
WHERE a.status = 'active';
-- View: Student fee summary
CREATE VIEW student_fee_summary_view AS
SELECT s.id,
  s.admission_number,
  CONCAT(s.first_name, ' ', s.last_name) as student_name,
  SUM(sfa.final_amount) as total_fees,
  SUM(
    CASE
      WHEN sfa.status = 'completed' THEN sfa.final_amount
      ELSE 0
    END
  ) as paid_fees,
  SUM(
    CASE
      WHEN sfa.status IN ('pending', 'partial', 'overdue') THEN sfa.final_amount
      ELSE 0
    END
  ) as pending_fees
FROM student s
  JOIN student_fee_assignment sfa ON s.id = sfa.student_id
GROUP BY s.id,
  s.admission_number,
  s.first_name,
  s.last_name;
-- ============================================================================
-- SQL Script ends
-- ============================================================================