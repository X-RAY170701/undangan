-- Skema MySQL untuk Undangan Digital (menggantikan Supabase/Postgres).
-- Jalankan sekali di database `undangan_digital`.

create table if not exists users (
  id char(36) primary key,
  email varchar(255) not null unique,
  password_hash varchar(255) not null,
  created_at timestamp not null default current_timestamp
) engine=InnoDB;

create table if not exists sessions (
  token char(64) primary key,
  user_id char(36) not null,
  expires_at timestamp not null,
  created_at timestamp not null default current_timestamp,
  foreign key (user_id) references users (id) on delete cascade
) engine=InnoDB;

create table if not exists templates (
  id char(36) primary key,
  slug varchar(100) not null unique,
  name varchar(255) not null,
  description text,
  thumbnail_url text,
  price int not null default 0,
  is_active boolean not null default true,
  created_at timestamp not null default current_timestamp
) engine=InnoDB;

create table if not exists orders (
  id char(36) primary key,
  user_id char(36) not null,
  template_id char(36) not null,
  status varchar(20) not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  midtrans_order_id varchar(255) not null unique,
  amount int not null,
  created_at timestamp not null default current_timestamp,
  foreign key (user_id) references users (id) on delete cascade,
  foreign key (template_id) references templates (id)
) engine=InnoDB;

create table if not exists invitations (
  id char(36) primary key,
  order_id char(36) not null,
  user_id char(36) not null,
  template_id char(36) not null,
  slug varchar(100) not null unique,
  data json not null,
  status varchar(20) not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  foreign key (order_id) references orders (id) on delete cascade,
  foreign key (user_id) references users (id) on delete cascade,
  foreign key (template_id) references templates (id)
) engine=InnoDB;

create table if not exists rsvp_responses (
  id char(36) primary key,
  invitation_id char(36) not null,
  guest_name varchar(200) not null,
  attendance varchar(20) not null check (attendance in ('hadir', 'tidak_hadir')),
  guest_count int not null default 1,
  message text,
  created_at timestamp not null default current_timestamp,
  foreign key (invitation_id) references invitations (id) on delete cascade
) engine=InnoDB;

create index idx_orders_user_id on orders (user_id);
create index idx_invitations_user_id on invitations (user_id);
create index idx_rsvp_invitation_id on rsvp_responses (invitation_id);

-- seed 6 template
insert into templates (id, slug, name, description, price, is_active) values
  (uuid(), 'elegant', 'Elegant', 'Desain undangan elegan dengan nuansa emas & krem, cocok untuk pernikahan formal.', 99000, true),
  (uuid(), 'modern-minimalist', 'Modern Minimalist', 'Desain hitam-putih yang bersih dan simpel, cocok untuk pasangan yang suka tampilan modern.', 99000, true),
  (uuid(), 'rustic-garden', 'Rustic Garden', 'Nuansa hijau daun & krem dengan sentuhan tulisan tangan, terinspirasi taman dan alam.', 99000, true),
  (uuid(), 'royal-luxury', 'Royal Luxury', 'Biru dongker & emas yang mewah, terinspirasi undangan kerajaan.', 129000, true),
  (uuid(), 'romantic-blush', 'Romantic Blush', 'Nuansa pink lembut dan romantis dengan tulisan kaligrafi.', 99000, true),
  (uuid(), 'heritage-maroon', 'Heritage Maroon', 'Merah marun & emas yang berkarakter kuat dan berkelas.', 129000, true),
  (uuid(), 'adat-jawa', 'Adat Jawa', 'Undangan bernuansa tradisi Jawa dengan animasi buka amplop 3D, motif gunungan, dan aksen batik bergerak.', 149000, true),
  (uuid(), 'starlight-3d', 'Starlight 3D', 'Latar debu bintang keemasan 3D yang interaktif — miring mengikuti gerakan pointer dan memercik cahaya saat disentuh.', 149000, true)
on duplicate key update slug = slug;
