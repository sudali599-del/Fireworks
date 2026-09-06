/**
 * Selvaganapathy Traders - Sun Flag Fireworks, Sivakasi
 * Official 2026 Price List & Product Catalog (164 Products)
 * Pure English Professional Catalog
 */

const PRODUCTS_DATA = [
  // ONE SOUND CRACKERS (1-12)
  { id: 1, category: "ONE SOUND CRACKERS", name: '2" Lakshmi', price: 25.00, per: "1 Pkt" },
  { id: 2, category: "ONE SOUND CRACKERS", name: '2 3/4" Kuruvi', price: 50.00, per: "1 Pkt" },
  { id: 3, category: "ONE SOUND CRACKERS", name: '3 1/2" Lakshmi, Pen Ten & Parrot', price: 60.00, per: "1 Pkt" },
  { id: 4, category: "ONE SOUND CRACKERS", name: '4" Lakshmi, Chhota Bheem & Parrot', price: 80.00, per: "1 Pkt" },
  { id: 5, category: "ONE SOUND CRACKERS", name: '4" Super Deluxe Lady', price: 150.00, per: "1 Pkt" },
  { id: 6, category: "ONE SOUND CRACKERS", name: '12 Ply Kumki', price: 160.00, per: "1 Pkt" },
  { id: 7, category: "ONE SOUND CRACKERS", name: '4" Gold Lakshmi', price: 160.00, per: "1 Pkt" },
  { id: 8, category: "ONE SOUND CRACKERS", name: '5" Bahubali', price: 250.00, per: "1 Pkt" },
  { id: 9, category: "ONE SOUND CRACKERS", name: 'Jallikattu Special', price: 275.00, per: "1 Pkt" },
  { id: 10, category: "ONE SOUND CRACKERS", name: 'Street Fighter', price: 500.00, per: "1 Pkt" },
  { id: 11, category: "ONE SOUND CRACKERS", name: 'Paper Vedi - (1/4 Kg)', price: 250.00, per: "1 Box" },
  { id: 12, category: "ONE SOUND CRACKERS", name: 'Paper Vedi - (1/2 Kg)', price: 500.00, per: "1 Box" },

  // FLOWER POTS (13-19)
  { id: 13, category: "FLOWER POTS", name: 'Flower Pots Small (10 Pcs)', price: 250.00, per: "1 Box" },
  { id: 14, category: "FLOWER POTS", name: 'Flower Pots Big (10 Pcs)', price: 325.00, per: "1 Box" },
  { id: 15, category: "FLOWER POTS", name: 'Flower Pots Special (10 Pcs)', price: 375.00, per: "1 Box" },
  { id: 16, category: "FLOWER POTS", name: 'Flower Pots Asoka (10 Pcs)', price: 550.00, per: "1 Box" },
  { id: 17, category: "FLOWER POTS", name: 'Colour Kotti (10 Pcs)', price: 950.00, per: "1 Box" },
  { id: 18, category: "FLOWER POTS", name: 'Flower Pots Deluxe (5 Pcs)', price: 800.00, per: "1 Box" },
  { id: 19, category: "FLOWER POTS", name: 'Luck Special (Red & Green) (5 Pcs)', price: 750.00, per: "1 Box" },

  // GROUND CHAKKAR (20-26)
  { id: 20, category: "GROUND CHAKKAR", name: 'Chakkar Big (10 Pcs)', price: 150.00, per: "1 Box" },
  { id: 21, category: "GROUND CHAKKAR", name: 'Chakkar Big (25 Pcs)', price: 350.00, per: "1 Box" },
  { id: 22, category: "GROUND CHAKKAR", name: 'Chakkar Special (10 Pcs)', price: 280.00, per: "1 Box" },
  { id: 23, category: "GROUND CHAKKAR", name: 'Chakkar Deluxe (10 Pcs)', price: 550.00, per: "1 Box" },
  { id: 24, category: "GROUND CHAKKAR", name: 'Wire Chakkar (10 Pcs)', price: 725.00, per: "1 Box" },
  { id: 25, category: "GROUND CHAKKAR", name: 'Special Spinner (10 Pcs)', price: 425.00, per: "1 Box" },
  { id: 26, category: "GROUND CHAKKAR", name: 'Spinner Mix (8 Pcs)', price: 800.00, per: "1 Box" },

  // ROCKETS (27-31)
  { id: 27, category: "ROCKETS", name: 'Baby Rocket', price: 150.00, per: "1 Box" },
  { id: 28, category: "ROCKETS", name: 'Lunik Express Rocket', price: 500.00, per: "1 Box" },
  { id: 29, category: "ROCKETS", name: '2 Sound Rocket', price: 600.00, per: "1 Box" },
  { id: 30, category: "ROCKETS", name: 'Colour Rocket', price: 275.00, per: "1 Box" },
  { id: 31, category: "ROCKETS", name: 'Musical Rocket', price: 750.00, per: "1 Box" },

  // TWINKLING STAR (32-33)
  { id: 32, category: "TWINKLING STAR", name: '1 1/2" Twinkling Star (10 Pcs)', price: 100.00, per: "1 Box" },
  { id: 33, category: "TWINKLING STAR", name: '4" Twinkling Star (10 Pcs)', price: 275.00, per: "1 Box" },

  // ELECTRIC CRACKERS (34-37)
  { id: 34, category: "ELECTRIC CRACKERS", name: '28 Chorsa Crackers', price: 70.00, per: "1 Pkt" },
  { id: 35, category: "ELECTRIC CRACKERS", name: '56 Chorsa Crackers', price: 150.00, per: "1 Pkt" },
  { id: 36, category: "ELECTRIC CRACKERS", name: '28 Giant Crackers', price: 125.00, per: "1 Pkt" },
  { id: 37, category: "ELECTRIC CRACKERS", name: '56 Giant Crackers', price: 250.00, per: "1 Pkt" },

  // DELUXE CRACKERS (38-39)
  { id: 38, category: "DELUXE CRACKERS", name: '24 DLX Crackers', price: 200.00, per: "1 Pkt" },
  { id: 39, category: "DELUXE CRACKERS", name: '50 DLX Crackers', price: 600.00, per: "1 Pkt" },

  // SPECIAL GARLANDS (40-44)
  { id: 40, category: "SPECIAL GARLANDS", name: '100 Power Garland', price: 200.00, per: "1 Box" },
  { id: 41, category: "SPECIAL GARLANDS", name: 'Silver Crackers (1K Fast)', price: 900.00, per: "1 Box" },
  { id: 42, category: "SPECIAL GARLANDS", name: 'Gold Crackers (2K Garland)', price: 1800.00, per: "1 Box" },
  { id: 43, category: "SPECIAL GARLANDS", name: 'Platinum Crackers (5K Garland)', price: 4500.00, per: "1 Box" },
  { id: 44, category: "SPECIAL GARLANDS", name: 'Diamond Crackers (10K Garland)', price: 9000.00, per: "1 Box" },

  // BIJILI (45-46)
  { id: 45, category: "BIJILI", name: 'Red Bijili (50 Pcs)', price: 80.00, per: "1 Pkt" },
  { id: 46, category: "BIJILI", name: 'Stripped Bijili (100 Pcs)', price: 225.00, per: "1 Pkt" },

  // BOMBS (47-52)
  { id: 47, category: "BOMBS", name: 'Bullet Bomb (10 Pcs)', price: 150.00, per: "1 Box" },
  { id: 48, category: "BOMBS", name: 'Hydro Bomb (10 Pcs)', price: 250.00, per: "1 Box" },
  { id: 49, category: "BOMBS", name: 'King of King (Kargil) (10 Pcs)', price: 350.00, per: "1 Box" },
  { id: 50, category: "BOMBS", name: 'Jug Mug Bomb (10 Pcs)', price: 450.00, per: "1 Box" },
  { id: 51, category: "BOMBS", name: 'Digital Seven Ply (10 Pcs)', price: 900.00, per: "1 Box" },
  { id: 52, category: "BOMBS", name: 'King Raider Mega Bomb (10 Pcs)', price: 1600.00, per: "1 Box" },

  // PENCIL & CANDLES (53-56)
  { id: 53, category: "PENCIL & CANDLES", name: 'Selfie Stick Sparkle (3 Pcs)', price: 160.00, per: "1 Box" },
  { id: 54, category: "PENCIL & CANDLES", name: 'Colour Smoke Rainbow (3 Pcs)', price: 750.00, per: "1 Box" },
  { id: 55, category: "PENCIL & CANDLES", name: 'Olympic Torch (3 Pcs)', price: 650.00, per: "1 Box" },
  { id: 56, category: "PENCIL & CANDLES", name: 'Jelly Candle Fireworks', price: 400.00, per: "1 Box" },

  // SPARKLERS (57-84)
  { id: 57, category: "SPARKLERS", name: '7 cm Electric Sparklers (10 Pcs)', price: 50.00, per: "1 Box" },
  { id: 58, category: "SPARKLERS", name: '7 cm Color Sparklers (10 Pcs)', price: 60.00, per: "1 Box" },
  { id: 59, category: "SPARKLERS", name: '7 cm Green Sparklers (10 Pcs)', price: 65.00, per: "1 Box" },
  { id: 60, category: "SPARKLERS", name: '7 cm Red Sparklers (10 Pcs)', price: 80.00, per: "1 Box" },
  { id: 61, category: "SPARKLERS", name: '10 cm Electric Sparklers (10 Pcs)', price: 85.00, per: "1 Box" },
  { id: 62, category: "SPARKLERS", name: '10 cm Color Sparklers (10 Pcs)', price: 95.00, per: "1 Box" },
  { id: 63, category: "SPARKLERS", name: '10 cm Green Sparklers (10 Pcs)', price: 110.00, per: "1 Box" },
  { id: 64, category: "SPARKLERS", name: '10 cm Red Sparklers (10 Pcs)', price: 125.00, per: "1 Box" },
  { id: 65, category: "SPARKLERS", name: '12 cm Electric Sparklers (10 Pcs)', price: 125.00, per: "1 Box" },
  { id: 66, category: "SPARKLERS", name: '12 cm Color Sparklers (10 Pcs)', price: 140.00, per: "1 Box" },
  { id: 67, category: "SPARKLERS", name: '12 cm Green Sparklers (10 Pcs)', price: 150.00, per: "1 Box" },
  { id: 68, category: "SPARKLERS", name: '12 cm Red Sparklers (10 Pcs)', price: 170.00, per: "1 Box" },
  { id: 69, category: "SPARKLERS", name: '15 cm Electric Sparklers (10 Pcs)', price: 185.00, per: "1 Box" },
  { id: 70, category: "SPARKLERS", name: '15 cm Color Sparklers (10 Pcs)', price: 205.00, per: "1 Box" },
  { id: 71, category: "SPARKLERS", name: '15 cm Green Sparklers (10 Pcs)', price: 225.00, per: "1 Box" },
  { id: 72, category: "SPARKLERS", name: '15 cm Red Sparklers (10 Pcs)', price: 260.00, per: "1 Box" },
  { id: 73, category: "SPARKLERS", name: '15 cm Silver Drops Sparklers', price: 345.00, per: "1 Box" },
  { id: 74, category: "SPARKLERS", name: '15 cm 5 in 1 Multi Sparklers', price: 1600.00, per: "1 Box" },
  { id: 75, category: "SPARKLERS", name: '30 cm Electric Sparklers (5 Pcs)', price: 185.00, per: "1 Box" },
  { id: 76, category: "SPARKLERS", name: '30 cm Color Sparklers (5 Pcs)', price: 205.00, per: "1 Box" },
  { id: 77, category: "SPARKLERS", name: '30 cm Green Sparklers (5 Pcs)', price: 225.00, per: "1 Box" },
  { id: 78, category: "SPARKLERS", name: '30 cm Red Sparklers (5 Pcs)', price: 260.00, per: "1 Box" },
  { id: 79, category: "SPARKLERS", name: '50 cm Electric Sparklers (5 Pcs)', price: 825.00, per: "1 Box" },
  { id: 80, category: "SPARKLERS", name: '50 cm Color Sparklers (5 Pcs)', price: 925.00, per: "1 Box" },
  { id: 81, category: "SPARKLERS", name: '50 cm Multimix Sparklers (5 Pcs)', price: 950.00, per: "1 Box" },
  { id: 82, category: "SPARKLERS", name: 'Rotating Sparklers (Mega)', price: 1075.00, per: "1 Box" },
  { id: 83, category: "SPARKLERS", name: '75 cm Giant Electric Sparklers', price: 1150.00, per: "1 Box" },
  { id: 84, category: "SPARKLERS", name: '75 cm Giant Colour Sparklers', price: 1250.00, per: "1 Box" },

  // MULTI COLOUR FOUNTAINS (85-88)
  { id: 85, category: "MULTI COLOUR FOUNTAINS", name: 'Pogo Fountain (5 Pcs)', price: 720.00, per: "1 Box" },
  { id: 86, category: "MULTI COLOUR FOUNTAINS", name: 'Shinchan Tricolour Fountain (3 Pcs)', price: 600.00, per: "1 Box" },
  { id: 87, category: "MULTI COLOUR FOUNTAINS", name: 'Motu Patlu Tricolour Fountain (5 Pcs)', price: 880.00, per: "1 Box" },
  { id: 88, category: "MULTI COLOUR FOUNTAINS", name: 'Splatoon Tricolour Super Deluxe (5 Pcs)', price: 1400.00, per: "1 Box" },

  // PEACOCK FOUNTAIN (89-94)
  { id: 89, category: "PEACOCK FOUNTAINS", name: 'Peacock Feather Fountain (5 Pcs)', price: 450.00, per: "1 Box" },
  { id: 90, category: "PEACOCK FOUNTAINS", name: 'Mini Peacock Fountain', price: 600.00, per: "1 Box" },
  { id: 91, category: "PEACOCK FOUNTAINS", name: 'Peacock 5 in 1 (Gold, Green, White)', price: 900.00, per: "1 Box" },
  { id: 92, category: "PEACOCK FOUNTAINS", name: 'Dancing Peacock Fountain', price: 750.00, per: "1 Box" },
  { id: 93, category: "PEACOCK FOUNTAINS", name: 'Magic Peacock (3 in 1)', price: 750.00, per: "1 Box" },
  { id: 94, category: "PEACOCK FOUNTAINS", name: 'Peacock Mega Multi-Colour (Padak)', price: 2500.00, per: "1 Box" },

  // MUSICAL ITEMS & SPINNERS (95-98)
  { id: 95, category: "MUSICAL & SPINNERS", name: 'Mini Siren Whistle (5 Pcs)', price: 575.00, per: "1 Box" },
  { id: 96, category: "MUSICAL & SPINNERS", name: 'Mega Siren Sound (3 Pcs)', price: 750.00, per: "1 Box" },
  { id: 97, category: "MUSICAL & SPINNERS", name: 'Butterfly Aerial (10 Pcs)', price: 325.00, per: "1 Box" },
  { id: 98, category: "MUSICAL & SPINNERS", name: 'Bambara Ground Spinner (10 Pcs)', price: 400.00, per: "1 Box" },

  // AERIAL FANCY (99-104)
  { id: 99, category: "AERIAL FANCY", name: 'Helicopter Aerial (5 Pcs)', price: 400.00, per: "1 Box" },
  { id: 100, category: "AERIAL FANCY", name: 'Drone Aerial (5 Pcs)', price: 650.00, per: "1 Box" },
  { id: 101, category: "AERIAL FANCY", name: 'Feast Show (5 Pcs)', price: 500.00, per: "1 Box" },
  { id: 102, category: "AERIAL FANCY", name: 'Army Force (5 Pcs)', price: 500.00, per: "1 Box" },
  { id: 103, category: "AERIAL FANCY", name: 'Sky Dancer (5 Pcs)', price: 550.00, per: "1 Box" },
  { id: 104, category: "AERIAL FANCY", name: 'Cool Collection (5 Pcs)', price: 775.00, per: "1 Box" },

  // AERIAL FANCY SHOTS (105-112)
  { id: 105, category: "AERIAL FANCY SHOTS", name: '1 1/4" Chotta Shot', price: 175.00, per: "1 Box" },
  { id: 106, category: "AERIAL FANCY SHOTS", name: '2" Pipe Single Shot (3 Pcs)', price: 1050.00, per: "1 Box" },
  { id: 107, category: "AERIAL FANCY SHOTS", name: '2 1/2" Pipe Royal Fancy', price: 650.00, per: "1 Box" },
  { id: 108, category: "AERIAL FANCY SHOTS", name: '3" Color Pipe Fancy Shot', price: 1250.00, per: "1 Box" },
  { id: 109, category: "AERIAL FANCY SHOTS", name: '3 1/2" Color Pipe Fancy Shot', price: 1350.00, per: "1 Box" },
  { id: 110, category: "AERIAL FANCY SHOTS", name: '3 1/2" Seven Step Colour Pipe Fancy', price: 1600.00, per: "1 Box" },
  { id: 111, category: "AERIAL FANCY SHOTS", name: '4" Colour Pipe Fancy Shot', price: 1400.00, per: "1 Box" },
  { id: 112, category: "AERIAL FANCY SHOTS", name: '4" Niagara Falls Mega Shot', price: 1500.00, per: "1 Box" },

  // AERIAL MULTI SHOTS (113-118)
  { id: 113, category: "AERIAL MULTI SHOTS", name: '7 Shots Sky Thunder (5 Pcs)', price: 350.00, per: "1 Box" },
  { id: 114, category: "AERIAL MULTI SHOTS", name: '12 Shots Multi Spectacular', price: 750.00, per: "1 Box" },
  { id: 115, category: "AERIAL MULTI SHOTS", name: '30 Shots Sky Show', price: 2100.00, per: "1 Box" },
  { id: 116, category: "AERIAL MULTI SHOTS", name: '60 Shots Mega Celebration', price: 4200.00, per: "1 Box" },
  { id: 117, category: "AERIAL MULTI SHOTS", name: '120 Shots Royal Extravaganza', price: 8400.00, per: "1 Box" },
  { id: 118, category: "AERIAL MULTI SHOTS", name: '240 Shots Grand Finale Show', price: 16800.00, per: "1 Box" },

  // SPECIAL FANCY FOUNTAINS (119-137)
  { id: 119, category: "SPECIAL FANCY FOUNTAINS", name: 'Trix / Goodly / Minions (3 Pcs)', price: 700.00, per: "1 Box" },
  { id: 120, category: "SPECIAL FANCY FOUNTAINS", name: 'Colour Rain Fountain (5 Pcs)', price: 450.00, per: "1 Box" },
  { id: 121, category: "SPECIAL FANCY FOUNTAINS", name: 'Golden Globe (5 Pcs)', price: 450.00, per: "1 Box" },
  { id: 122, category: "SPECIAL FANCY FOUNTAINS", name: 'Tweet Poppings 6000', price: 575.00, per: "1 Box" },
  { id: 123, category: "SPECIAL FANCY FOUNTAINS", name: 'Lotus Fountain (3 Pcs)', price: 550.00, per: "1 Box" },
  { id: 124, category: "SPECIAL FANCY FOUNTAINS", name: 'Red / Green / Silver / Golden Star (3 Pcs)', price: 700.00, per: "1 Box" },
  { id: 125, category: "SPECIAL FANCY FOUNTAINS", name: 'Gold Feast, Red Sun & Blue Ice (5 Pcs)', price: 800.00, per: "1 Box" },
  { id: 126, category: "SPECIAL FANCY FOUNTAINS", name: 'Power Pot Fountain (5 Pcs)', price: 900.00, per: "1 Box" },
  { id: 127, category: "SPECIAL FANCY FOUNTAINS", name: 'Twix Magic Fountain (5 Pcs)', price: 700.00, per: "1 Box" },
  { id: 128, category: "SPECIAL FANCY FOUNTAINS", name: 'Sun Feast Fountain (5 Pcs)', price: 750.00, per: "1 Box" },
  { id: 129, category: "SPECIAL FANCY FOUNTAINS", name: 'Croods / Angel Time / GoldFish', price: 750.00, per: "1 Box" },
  { id: 130, category: "SPECIAL FANCY FOUNTAINS", name: 'Money Bank Millionaire (2 Pcs)', price: 900.00, per: "1 Box" },
  { id: 131, category: "SPECIAL FANCY FOUNTAINS", name: 'Wonder 3 in 1 Crackling', price: 1050.00, per: "1 Box" },
  { id: 132, category: "SPECIAL FANCY FOUNTAINS", name: 'Pom Pom Fountain (30 Pcs)', price: 1050.00, per: "1 Box" },
  { id: 133, category: "SPECIAL FANCY FOUNTAINS", name: 'Rope Colour Fountain (4 Pcs)', price: 1000.00, per: "1 Box" },
  { id: 134, category: "SPECIAL FANCY FOUNTAINS", name: 'Touch Me Falls Fountain', price: 700.00, per: "1 Box" },
  { id: 135, category: "SPECIAL FANCY FOUNTAINS", name: 'Angry Bird Special Fountain', price: 1350.00, per: "1 Box" },
  { id: 136, category: "SPECIAL FANCY FOUNTAINS", name: 'Carnival / Tweet Bird / Bingo (3 Pcs)', price: 600.00, per: "1 Box" },
  { id: 137, category: "SPECIAL FANCY FOUNTAINS", name: 'Colour Gems Fountain', price: 550.00, per: "1 Box" },

  // SPECIAL FOUNTAINS (138-148)
  { id: 138, category: "SPECIAL FOUNTAINS", name: 'Magical Pots (5 Pcs)', price: 1000.00, per: "1 Box" },
  { id: 139, category: "SPECIAL FOUNTAINS", name: 'Diamond Bursters (5 Pcs)', price: 750.00, per: "1 Box" },
  { id: 140, category: "SPECIAL FOUNTAINS", name: 'Multi Colour Shower (5 Pcs)', price: 750.00, per: "1 Box" },
  { id: 141, category: "SPECIAL FOUNTAINS", name: 'MRF Bat and Ball', price: 1200.00, per: "1 Pce" },
  { id: 142, category: "SPECIAL FOUNTAINS", name: '90 Watts', price: 550.00, per: "1 Box" },
  { id: 143, category: "SPECIAL FOUNTAINS", name: 'H2O Falls', price: 650.00, per: "1 Box" },
  { id: 144, category: "SPECIAL FOUNTAINS", name: 'King Fisher / Henieken / Crystal Tinbeer', price: 375.00, per: "1 Box" },
  { id: 145, category: "SPECIAL FOUNTAINS", name: 'Old is Gold', price: 800.00, per: "1 Box" },
  { id: 146, category: "SPECIAL FOUNTAINS", name: 'Mini Rail', price: 250.00, per: "1 Box" },
  { id: 147, category: "SPECIAL FOUNTAINS", name: 'Photo Flash (5 Pcs)', price: 200.00, per: "1 Box" },
  { id: 148, category: "SPECIAL FOUNTAINS", name: 'I Cone (2 Pcs)', price: 1000.00, per: "1 Box" },

  // NEW ARRIVAL FOUNTAINS (149-153)
  { id: 149, category: "NEW ARRIVAL FOUNTAINS", name: 'Rock Stars', price: 700.00, per: "1 No" },
  { id: 150, category: "NEW ARRIVAL FOUNTAINS", name: 'Sizzling Star', price: 950.00, per: "1 Box" },
  { id: 151, category: "NEW ARRIVAL FOUNTAINS", name: 'Jolly Poppy', price: 2500.00, per: "1 Box" },
  { id: 152, category: "NEW ARRIVAL FOUNTAINS", name: 'King Version', price: 900.00, per: "1 Box" },
  { id: 153, category: "NEW ARRIVAL FOUNTAINS", name: 'Kulfi (2 Pcs)', price: 1500.00, per: "1 Box" },

  // CHILDRENS SPECIAL (154-163)
  { id: 154, category: "CHILDRENS SPECIAL", name: 'Magic Pops', price: 35.00, per: "1 Box" },
  { id: 155, category: "CHILDRENS SPECIAL", name: 'Jee Boom Baa', price: 35.00, per: "1 Box" },
  { id: 156, category: "CHILDRENS SPECIAL", name: 'Electric Stone', price: 40.00, per: "1 Box" },
  { id: 157, category: "CHILDRENS SPECIAL", name: 'Cartoon (5 Pcs)', price: 50.00, per: "1 Box" },
  { id: 158, category: "CHILDRENS SPECIAL", name: 'Kit Kat', price: 160.00, per: "1 Box" },
  { id: 159, category: "CHILDRENS SPECIAL", name: 'Asrafi Big (5 Pcs)', price: 200.00, per: "1 Box" },
  { id: 160, category: "CHILDRENS SPECIAL", name: 'Super Dulex', price: 400.00, per: "1 Box" },
  { id: 161, category: "CHILDRENS SPECIAL", name: 'Pokemon Queen 10-in-1 (Laptop)', price: 750.00, per: "1 Box" },
  { id: 162, category: "CHILDRENS SPECIAL", name: 'Roll Caps', price: 450.00, per: "1 Box" },
  { id: 163, category: "CHILDRENS SPECIAL", name: 'Black Serpnet (1 Dozen)', price: 250.00, per: "1 Box" },

  // GIFT BOXES (164-167)
  { id: 164, category: "GIFT BOXES", name: '20 Items Gift Box', price: 1250.00, per: "1 Box" },
  { id: 165, category: "GIFT BOXES", name: '30 Items Gift Box', price: 1750.00, per: "1 Box" },
  { id: 166, category: "GIFT BOXES", name: '40 Items Gift Box', price: 2750.00, per: "1 Box" },
  { id: 167, category: "GIFT BOXES", name: '50 Items Gift Box', price: 3750.00, per: "1 Box" }
];

// Clean Unique Categories List
const CATEGORIES = [
  "ALL",
  "ONE SOUND CRACKERS",
  "FLOWER POTS",
  "GROUND CHAKKAR",
  "ROCKETS",
  "TWINKLING STAR",
  "ELECTRIC CRACKERS",
  "DELUXE CRACKERS",
  "SPECIAL GARLANDS",
  "BIJILI",
  "BOMBS",
  "PENCIL & CANDLES",
  "SPARKLERS",
  "MULTI COLOUR FOUNTAINS",
  "PEACOCK FOUNTAINS",
  "MUSICAL & SPINNERS",
  "AERIAL FANCY",
  "AERIAL FANCY SHOTS",
  "AERIAL MULTI SHOTS",
  "SPECIAL FANCY FOUNTAINS",
  "SPECIAL FOUNTAINS",
  "NEW ARRIVAL FOUNTAINS",
  "CHILDRENS SPECIAL",
  "GIFT BOXES"
];

// Export for Window and Node environments
if (typeof window !== "undefined") {
  try {
    const customData = localStorage.getItem("FIREWORKS_PRODUCTS_CUSTOM");
    if (customData) {
      window.PRODUCTS_DATA = JSON.parse(customData);
    } else {
      window.PRODUCTS_DATA = PRODUCTS_DATA;
    }
  } catch (e) {
    window.PRODUCTS_DATA = PRODUCTS_DATA;
  }
  window.CATEGORIES = CATEGORIES;
  window.FACTORY_DEFAULT_PRODUCTS = PRODUCTS_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRODUCTS_DATA, CATEGORIES };
}
