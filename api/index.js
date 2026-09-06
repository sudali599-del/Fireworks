const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sudali599_del:1234567890@cluster0.zox27.mongodb.net/fireworks?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.warn('MongoDB connection notice:', err.message);
  }
}

// Product Schema
const productSchema = new mongoose.Schema({
  sno: { type: Number },
  name: { type: String, required: true },
  productType: { type: String, required: true },
  actualPrice: { type: Number, required: true },
  discountedPrice: { type: Number },
  discount: { type: Number, default: 0 },
  per: { type: String, default: '1 Pkt' },
  productDescription: { type: String },
  imageName: { type: String },
  imageType: { type: String },
  imageData: { type: Buffer }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// In-Memory OTP Store
const otpStore = new Map();

// Nodemailer Transporter
function createTransporter() {
  const senderEmail = process.env.SENDER_EMAIL || 'sudali599@gmail.com';
  const mailPassword = (process.env.MAIL_PASSWORD || 'aalfrphjajyiiwdj').replace(/\s+/g, '');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: mailPassword,
    },
  });
}

// Fallback 167-product catalog
const FALLBACK_PRODUCTS = [
  { _id: '1', sno: 1, productType: 'ONE SOUND CRACKERS', name: '2 3/4" Kuruvi', actualPrice: 12.00, per: '1 Pkt' },
  { _id: '2', sno: 2, productType: 'ONE SOUND CRACKERS', name: '3 1/2" Lakshmi', actualPrice: 20.00, per: '1 Pkt' },
  { _id: '3', sno: 3, productType: 'ONE SOUND CRACKERS', name: '4" Lakshmi', actualPrice: 26.00, per: '1 Pkt' },
  { _id: '4', sno: 4, productType: 'ONE SOUND CRACKERS', name: '4" Deluxe Lakshmi', actualPrice: 38.00, per: '1 Pkt' },
  { _id: '5', sno: 5, productType: 'ONE SOUND CRACKERS', name: '4" Gold Lakshmi', actualPrice: 42.00, per: '1 Pkt' },
  { _id: '6', sno: 6, productType: 'ONE SOUND CRACKERS', name: '4" Super Deluxe', actualPrice: 46.00, per: '1 Pkt' },
  { _id: '7', sno: 7, productType: 'ONE SOUND CRACKERS', name: '5" Mega Deluxe', actualPrice: 65.00, per: '1 Pkt' },
  { _id: '8', sno: 8, productType: 'ONE SOUND CRACKERS', name: '6" Super Sound', actualPrice: 85.00, per: '1 Pkt' },
  { _id: '9', sno: 9, productType: 'FLOWER POTS', name: 'Flower Pots Big', actualPrice: 110.00, per: '1 Box' },
  { _id: '10', sno: 10, productType: 'FLOWER POTS', name: 'Flower Pots Special', actualPrice: 160.00, per: '1 Box' },
  { _id: '11', sno: 11, productType: 'FLOWER POTS', name: 'Flower Pots Asoka', actualPrice: 220.00, per: '1 Box' },
  { _id: '12', sno: 12, productType: 'FLOWER POTS', name: 'Flower Pots Deluxe', actualPrice: 280.00, per: '1 Box' },
  { _id: '13', sno: 13, productType: 'FLOWER POTS', name: 'Colour Koti', actualPrice: 340.00, per: '1 Box' },
  { _id: '14', sno: 14, productType: 'FLOWER POTS', name: 'Flower Pots Super Jumbo', actualPrice: 450.00, per: '1 Box' },
  { _id: '15', sno: 15, productType: 'GROUND CHAKKAR', name: 'Ground Chakkar Big (10 Pcs)', actualPrice: 70.00, per: '1 Box' },
  { _id: '16', sno: 16, productType: 'GROUND CHAKKAR', name: 'Ground Chakkar Special (10 Pcs)', actualPrice: 120.00, per: '1 Box' },
  { _id: '17', sno: 17, productType: 'GROUND CHAKKAR', name: 'Ground Chakkar Deluxe (10 Pcs)', actualPrice: 180.00, per: '1 Box' },
  { _id: '18', sno: 18, productType: 'GROUND CHAKKAR', name: 'Spinner / Wheel Supreme (10 Pcs)', actualPrice: 240.00, per: '1 Box' },
  { _id: '19', sno: 19, productType: 'GROUND CHAKKAR', name: 'Whistling Wheel Deluxe (5 Pcs)', actualPrice: 260.00, per: '1 Box' },
  { _id: '20', sno: 20, productType: 'ROCKETS', name: 'Baby Rocket (10 Pcs)', actualPrice: 90.00, per: '1 Box' },
  { _id: '21', sno: 21, productType: 'ROCKETS', name: 'Rocket Bomb (10 Pcs)', actualPrice: 140.00, per: '1 Box' },
  { _id: '22', sno: 22, productType: 'ROCKETS', name: 'Lunik Rocket Sound (10 Pcs)', actualPrice: 190.00, per: '1 Box' },
  { _id: '23', sno: 23, productType: 'ROCKETS', name: 'Whistling Rocket (10 Pcs)', actualPrice: 250.00, per: '1 Box' },
  { _id: '24', sno: 24, productType: 'ROCKETS', name: 'Parachute Rocket with Light (5 Pcs)', actualPrice: 320.00, per: '1 Box' },
  { _id: '25', sno: 25, productType: 'TWINKLING STAR', name: '1 1/2" Twinkling Star', actualPrice: 50.00, per: '1 Box' },
  { _id: '26', sno: 26, productType: 'TWINKLING STAR', name: '4" Twinkling Star Deluxe', actualPrice: 120.00, per: '1 Box' },
  { _id: '27', sno: 27, productType: 'TWINKLING STAR', name: 'Star Light Twinklers', actualPrice: 160.00, per: '1 Box' },
  { _id: '28', sno: 28, productType: 'ELECTRIC CRACKERS', name: '28 Chorsa Special', actualPrice: 45.00, per: '1 Pkt' },
  { _id: '29', sno: 29, productType: 'ELECTRIC CRACKERS', name: '28 Giant Crackers', actualPrice: 75.00, per: '1 Pkt' },
  { _id: '30', sno: 30, productType: 'ELECTRIC CRACKERS', name: '56 Giant Crackers', actualPrice: 150.00, per: '1 Pkt' },
  { _id: '31', sno: 31, productType: 'ELECTRIC CRACKERS', name: '28 Deluxe Crackers', actualPrice: 90.00, per: '1 Pkt' },
  { _id: '32', sno: 32, productType: 'ELECTRIC CRACKERS', name: '56 Deluxe Crackers', actualPrice: 180.00, per: '1 Pkt' },
  { _id: '33', sno: 33, productType: 'DELUXE CRACKERS', name: '24 Deluxe Sound', actualPrice: 110.00, per: '1 Box' },
  { _id: '34', sno: 34, productType: 'DELUXE CRACKERS', name: '50 Deluxe Sound', actualPrice: 220.00, per: '1 Box' },
  { _id: '35', sno: 35, productType: 'DELUXE CRACKERS', name: '100 Deluxe Sound', actualPrice: 420.00, per: '1 Box' },
  { _id: '36', sno: 36, productType: 'DELUXE CRACKERS', name: 'Classic Gold Sound', actualPrice: 260.00, per: '1 Box' },
  { _id: '37', sno: 37, productType: 'SPECIAL GARLANDS', name: '100 Wala Special Garland', actualPrice: 65.00, per: '1 Box' },
  { _id: '38', sno: 38, productType: 'SPECIAL GARLANDS', name: '200 Wala Festive Garland', actualPrice: 130.00, per: '1 Box' },
  { _id: '39', sno: 39, productType: 'SPECIAL GARLANDS', name: '300 Wala Grand Garland', actualPrice: 195.00, per: '1 Box' },
  { _id: '40', sno: 40, productType: 'SPECIAL GARLANDS', name: '1000 Wala Heavy Garland', actualPrice: 380.00, per: '1 Box' },
  { _id: '41', sno: 41, productType: 'SPECIAL GARLANDS', name: '2000 Wala Long Garland', actualPrice: 750.00, per: '1 Box' },
  { _id: '42', sno: 42, productType: 'SPECIAL GARLANDS', name: '5000 Wala Celebration Garland', actualPrice: 1850.00, per: '1 Box' },
  { _id: '43', sno: 43, productType: 'SPECIAL GARLANDS', name: '10000 Wala Mega Garland', actualPrice: 3600.00, per: '1 Box' },
  { _id: '44', sno: 44, productType: 'BIJILI', name: 'Red Bijili Stripped (50 Pcs)', actualPrice: 38.00, per: '1 Bag' },
  { _id: '45', sno: 45, productType: 'BIJILI', name: 'Red Bijili Stripped (100 Pcs)', actualPrice: 75.00, per: '1 Bag' },
  { _id: '46', sno: 46, productType: 'BIJILI', name: 'Silver Streak Bijili (100 Pcs)', actualPrice: 85.00, per: '1 Bag' },
  { _id: '47', sno: 47, productType: 'BOMBS', name: 'Classic Bullet Bomb', actualPrice: 60.00, per: '1 Box' },
  { _id: '48', sno: 48, productType: 'BOMBS', name: 'Hydro Bomb Green', actualPrice: 95.00, per: '1 Box' },
  { _id: '49', sno: 49, productType: 'BOMBS', name: 'King of King Bomb', actualPrice: 130.00, per: '1 Box' },
  { _id: '50', sno: 50, productType: 'BOMBS', name: 'Agni Bomb Heavy', actualPrice: 150.00, per: '1 Box' },
  { _id: '51', sno: 51, productType: 'BOMBS', name: 'Digital Bomb / Paper Bomb', actualPrice: 180.00, per: '1 Box' },
  { _id: '52', sno: 52, productType: 'BOMBS', name: 'Thunder Blast Bomb', actualPrice: 210.00, per: '1 Box' },
  { _id: '53', sno: 53, productType: 'BOMBS', name: 'Mega Volcano Bomb', actualPrice: 240.00, per: '1 Box' },
  { _id: '54', sno: 54, productType: 'PENCIL', name: 'Poplar Candle Pencil (3 Pcs)', actualPrice: 90.00, per: '1 Box' },
  { _id: '55', sno: 55, productType: 'PENCIL', name: 'Colour Candle Deluxe (3 Pcs)', actualPrice: 140.00, per: '1 Box' },
  { _id: '56', sno: 56, productType: 'PENCIL', name: 'Magic Stick Pencil (5 Pcs)', actualPrice: 160.00, per: '1 Box' },
  { _id: '57', sno: 57, productType: 'PENCIL', name: 'Rainbow Pencil Giant', actualPrice: 220.00, per: '1 Box' },
  { _id: '58', sno: 58, productType: 'SPARKLERS', name: '7cm Electric Sparklers', actualPrice: 22.00, per: '1 Box' },
  { _id: '59', sno: 59, productType: 'SPARKLERS', name: '7cm Colour Sparklers', actualPrice: 26.00, per: '1 Box' },
  { _id: '60', sno: 60, productType: 'SPARKLERS', name: '7cm Green Sparklers', actualPrice: 30.00, per: '1 Box' },
  { _id: '61', sno: 61, productType: 'SPARKLERS', name: '7cm Red Sparklers', actualPrice: 32.00, per: '1 Box' },
  { _id: '62', sno: 62, productType: 'SPARKLERS', name: '10cm Electric Sparklers', actualPrice: 42.00, per: '1 Box' },
  { _id: '63', sno: 63, productType: 'SPARKLERS', name: '10cm Colour Sparklers', actualPrice: 48.00, per: '1 Box' },
  { _id: '64', sno: 64, productType: 'SPARKLERS', name: '10cm Green Sparklers', actualPrice: 54.00, per: '1 Box' },
  { _id: '65', sno: 65, productType: 'SPARKLERS', name: '10cm Red Sparklers', actualPrice: 58.00, per: '1 Box' },
  { _id: '66', sno: 66, productType: 'SPARKLERS', name: '12cm Electric Sparklers', actualPrice: 65.00, per: '1 Box' },
  { _id: '67', sno: 67, productType: 'SPARKLERS', name: '12cm Colour Sparklers', actualPrice: 72.00, per: '1 Box' },
  { _id: '68', sno: 68, productType: 'SPARKLERS', name: '15cm Electric Sparklers', actualPrice: 95.00, per: '1 Box' },
  { _id: '69', sno: 69, productType: 'SPARKLERS', name: '15cm Colour Sparklers', actualPrice: 110.00, per: '1 Box' },
  { _id: '70', sno: 70, productType: 'SPARKLERS', name: '30cm Electric Sparklers (5 in 1)', actualPrice: 180.00, per: '1 Box' },
  { _id: '71', sno: 71, productType: 'SPARKLERS', name: '30cm Colour Sparklers (5 in 1)', actualPrice: 195.00, per: '1 Box' },
  { _id: '72', sno: 72, productType: 'SPARKLERS', name: '50cm Mega Giant Sparklers', actualPrice: 360.00, per: '1 Box' },
  { _id: '73', sno: 73, productType: 'FANCY FOUNTAINS', name: 'Colour Rain Fountain (5 Pcs)', actualPrice: 450.00, per: '1 Box' },
  { _id: '74', sno: 74, productType: 'FANCY FOUNTAINS', name: 'Golden Globe (5 Pcs)', actualPrice: 450.00, per: '1 Box' },
  { _id: '75', sno: 75, productType: 'FANCY FOUNTAINS', name: 'Lotus Fountain (3 Pcs)', actualPrice: 550.00, per: '1 Box' },
  { _id: '76', sno: 76, productType: 'FANCY FOUNTAINS', name: 'Tweet Poppings 6000', actualPrice: 575.00, per: '1 Box' },
  { _id: '77', sno: 77, productType: 'FANCY FOUNTAINS', name: 'Trix / Goodly / Minions (3 Pcs)', actualPrice: 700.00, per: '1 Box' },
  { _id: '78', sno: 78, productType: 'FANCY FOUNTAINS', name: 'Twix Magic Fountain (5 Pcs)', actualPrice: 700.00, per: '1 Box' },
  { _id: '79', sno: 79, productType: 'FANCY FOUNTAINS', name: 'Sun Feast Fountain (5 Pcs)', actualPrice: 750.00, per: '1 Box' },
  { _id: '80', sno: 80, productType: 'FANCY FOUNTAINS', name: 'Power Pot Fountain (5 Pcs)', actualPrice: 900.00, per: '1 Box' },
  { _id: '81', sno: 81, productType: 'FANCY FOUNTAINS', name: 'Wonder 3 in 1 Crackling', actualPrice: 1050.00, per: '1 Box' },
  { _id: '82', sno: 82, productType: 'FANCY FOUNTAINS', name: 'Angry Bird Special Fountain', actualPrice: 1350.00, per: '1 Box' },
  { _id: '83', sno: 83, productType: 'MUSICAL ITEMS', name: 'Siren / Whistle King (5 Pcs)', actualPrice: 220.00, per: '1 Box' },
  { _id: '84', sno: 84, productType: 'MUSICAL ITEMS', name: 'Musical Wheel Spinner', actualPrice: 260.00, per: '1 Box' },
  { _id: '85', sno: 85, productType: 'MUSICAL ITEMS', name: 'Whistling Jumbo Fountain', actualPrice: 380.00, per: '1 Box' },
  { _id: '86', sno: 86, productType: 'MUSICAL ITEMS', name: 'Dancing Peacock Musical', actualPrice: 480.00, per: '1 Box' },
  { _id: '87', sno: 87, productType: 'MUSICAL ITEMS', name: 'Musical Thunder Bomb (3 Pcs)', actualPrice: 320.00, per: '1 Box' },
  { _id: '88', sno: 88, productType: 'MUSICAL ITEMS', name: 'Symphony Aerial Whistle', actualPrice: 550.00, per: '1 Box' },
  { _id: '89', sno: 89, productType: 'AERIAL FANCY', name: '1 1/4" Chotta Shot Single', actualPrice: 175.00, per: '1 Box' },
  { _id: '90', sno: 90, productType: 'AERIAL FANCY', name: '2" Pipe Single Shot (3 Pcs)', actualPrice: 1050.00, per: '1 Box' },
  { _id: '91', sno: 91, productType: 'AERIAL FANCY', name: '2 1/2" Pipe Royal Fancy', actualPrice: 650.00, per: '1 Box' },
  { _id: '92', sno: 92, productType: 'AERIAL FANCY', name: '3" Color Pipe Fancy Shot', actualPrice: 1250.00, per: '1 Box' },
  { _id: '93', sno: 93, productType: 'AERIAL FANCY', name: '3 1/2" Color Pipe Fancy Shot', actualPrice: 1350.00, per: '1 Box' },
  { _id: '94', sno: 94, productType: 'AERIAL FANCY', name: '3 1/2" Seven Step Pipe Fancy', actualPrice: 1600.00, per: '1 Box' },
  { _id: '95', sno: 95, productType: 'AERIAL FANCY', name: '4" Colour Pipe Fancy Shot', actualPrice: 1400.00, per: '1 Box' },
  { _id: '96', sno: 96, productType: 'AERIAL FANCY', name: '4" Niagara Falls Mega Shot', actualPrice: 1500.00, per: '1 Box' },
  { _id: '97', sno: 97, productType: 'AERIAL FANCY SHOTS', name: '7 Shots Sky Thunder (5 Pcs)', actualPrice: 350.00, per: '1 Box' },
  { _id: '98', sno: 98, productType: 'AERIAL FANCY SHOTS', name: '12 Shots Multi Spectacular', actualPrice: 750.00, per: '1 Box' },
  { _id: '99', sno: 99, productType: 'AERIAL FANCY SHOTS', name: '15 Shots Sky Rider', actualPrice: 950.00, per: '1 Box' },
  { _id: '100', sno: 100, productType: 'AERIAL FANCY SHOTS', name: '30 Shots Sky Show', actualPrice: 2100.00, per: '1 Box' },
  { _id: '101', sno: 101, productType: 'AERIAL FANCY SHOTS', name: '60 Shots Mega Celebration', actualPrice: 4200.00, per: '1 Box' },
  { _id: '102', sno: 102, productType: 'AERIAL FANCY SHOTS', name: '120 Shots Royal Extravaganza', actualPrice: 8400.00, per: '1 Box' },
  { _id: '103', sno: 103, productType: 'AERIAL FANCY SHOTS', name: '240 Shots Grand Finale Show', actualPrice: 16800.00, per: '1 Box' },
  { _id: '104', sno: 104, productType: 'AERIAL FANCY SHOTS', name: '500 Shots Ultra Royal Gala', actualPrice: 32000.00, per: '1 Box' },
  { _id: '105', sno: 105, productType: 'AERIAL MULTI SHOTS FANCY', name: '12 Shots Color Pearl', actualPrice: 550.00, per: '1 Box' },
  { _id: '106', sno: 106, productType: 'AERIAL MULTI SHOTS FANCY', name: '25 Shots Golden Willow', actualPrice: 1350.00, per: '1 Box' },
  { _id: '107', sno: 107, productType: 'AERIAL MULTI SHOTS FANCY', name: '50 Shots Glittering Brocade', actualPrice: 2800.00, per: '1 Box' },
  { _id: '108', sno: 108, productType: 'AERIAL MULTI SHOTS FANCY', name: '100 Shots Multi Colour Magic', actualPrice: 5400.00, per: '1 Box' },
  { _id: '109', sno: 109, productType: 'AERIAL MULTI SHOTS FANCY', name: '150 Shots Night Queen Star', actualPrice: 8200.00, per: '1 Box' },
  { _id: '110', sno: 110, productType: 'AERIAL MULTI SHOTS FANCY', name: '300 Shots Emperor Sovereign', actualPrice: 19500.00, per: '1 Box' },
  { _id: '111', sno: 111, productType: 'SPECIAL FANCY FOUNTAIN', name: 'Gold Feast, Red Sun & Blue Ice (5 Pcs)', actualPrice: 800.00, per: '1 Box' },
  { _id: '112', sno: 112, productType: 'SPECIAL FANCY FOUNTAIN', name: 'Croods / Angel Time / GoldFish', actualPrice: 750.00, per: '1 Box' },
  { _id: '113', sno: 113, productType: 'SPECIAL FANCY FOUNTAIN', name: 'Money Bank Millionaire (2 Pcs)', actualPrice: 900.00, per: '1 Box' },
  { _id: '114', sno: 114, productType: 'SPECIAL FANCY FOUNTAIN', name: 'Pom Pom Fountain (30 Pcs)', actualPrice: 1050.00, per: '1 Box' },
  { _id: '115', sno: 115, productType: 'SPECIAL FANCY FOUNTAIN', name: 'Rope Colour Fountain (4 Pcs)', actualPrice: 1000.00, per: '1 Box' },
  { _id: '116', sno: 116, productType: 'SPECIAL FANCY FOUNTAIN', name: 'Touch Me Falls Fountain', actualPrice: 700.00, per: '1 Box' },
  { _id: '117', sno: 117, productType: 'SPECIAL FANCY FOUNTAIN', name: 'Carnival / Tweet Bird / Bingo (3 Pcs)', actualPrice: 600.00, per: '1 Box' },
  { _id: '118', sno: 118, productType: 'SPECIAL FANCY FOUNTAIN', name: 'Colour Gems Fountain', actualPrice: 550.00, per: '1 Box' },
  { _id: '119', sno: 119, productType: 'SPECIAL FANCY FOUNTAIN', name: 'Silver Smoke Screen', actualPrice: 420.00, per: '1 Box' },
  { _id: '120', sno: 120, productType: 'SPECIAL FANCY FOUNTAIN', name: 'Golden Shower Cascade', actualPrice: 680.00, per: '1 Box' },
  { _id: '121', sno: 121, productType: 'SPECIAL FOUNTAINS', name: 'Magical Pots (5 Pcs)', actualPrice: 1000.00, per: '1 Box' },
  { _id: '122', sno: 122, productType: 'SPECIAL FOUNTAINS', name: 'Diamond Bursters (5 Pcs)', actualPrice: 750.00, per: '1 Box' },
  { _id: '123', sno: 123, productType: 'SPECIAL FOUNTAINS', name: 'Multi Colour Shower (5 Pcs)', actualPrice: 750.00, per: '1 Box' },
  { _id: '124', sno: 124, productType: 'SPECIAL FOUNTAINS', name: 'MRF Bat and Ball', actualPrice: 1200.00, per: '1 Pce' },
  { _id: '125', sno: 125, productType: 'SPECIAL FOUNTAINS', name: '90 Watts', actualPrice: 550.00, per: '1 Box' },
  { _id: '126', sno: 126, productType: 'SPECIAL FOUNTAINS', name: 'H2O Falls', actualPrice: 650.00, per: '1 Box' },
  { _id: '127', sno: 127, productType: 'SPECIAL FOUNTAINS', name: 'King Fisher / Crystal Tinbeer', actualPrice: 375.00, per: '1 Box' },
  { _id: '128', sno: 128, productType: 'SPECIAL FOUNTAINS', name: 'Old is Gold', actualPrice: 800.00, per: '1 Box' },
  { _id: '129', sno: 129, productType: 'SPECIAL FOUNTAINS', name: 'Mini Rail', actualPrice: 250.00, per: '1 Box' },
  { _id: '130', sno: 130, productType: 'SPECIAL FOUNTAINS', name: 'Photo Flash (5 Pcs)', actualPrice: 200.00, per: '1 Box' },
  { _id: '131', sno: 131, productType: 'NEW ARRIVAL FOUNTAINS', name: 'I Cone (2 Pcs)', actualPrice: 1000.00, per: '1 Box' },
  { _id: '132', sno: 132, productType: 'NEW ARRIVAL FOUNTAINS', name: 'Rock Stars', actualPrice: 700.00, per: '1 No' },
  { _id: '133', sno: 133, productType: 'NEW ARRIVAL FOUNTAINS', name: 'Sizzling Star', actualPrice: 950.00, per: '1 Box' },
  { _id: '134', sno: 134, productType: 'NEW ARRIVAL FOUNTAINS', name: 'Jolly Poppy', actualPrice: 2500.00, per: '1 Box' },
  { _id: '135', sno: 135, productType: 'NEW ARRIVAL FOUNTAINS', name: 'King Version', actualPrice: 900.00, per: '1 Box' },
  { _id: '136', sno: 136, productType: 'NEW ARRIVAL FOUNTAINS', name: 'Kulfi (2 Pcs)', actualPrice: 1500.00, per: '1 Box' },
  { _id: '137', sno: 137, productType: 'NEW ARRIVAL FOUNTAINS', name: 'Galaxy Spinner Fountain', actualPrice: 1100.00, per: '1 Box' },
  { _id: '138', sno: 138, productType: 'CHILDRENS FANCY', name: 'Magic Pops', actualPrice: 35.00, per: '1 Box' },
  { _id: '139', sno: 139, productType: 'CHILDRENS FANCY', name: 'Jee Boom Baa', actualPrice: 35.00, per: '1 Box' },
  { _id: '140', sno: 140, productType: 'CHILDRENS FANCY', name: 'Electric Stone', actualPrice: 40.00, per: '1 Box' },
  { _id: '141', sno: 141, productType: 'CHILDRENS FANCY', name: 'Cartoon (5 Pcs)', actualPrice: 50.00, per: '1 Box' },
  { _id: '142', sno: 142, productType: 'CHILDRENS FANCY', name: 'Kit Kat', actualPrice: 160.00, per: '1 Box' },
  { _id: '143', sno: 143, productType: 'CHILDRENS FANCY', name: 'Asrafi Big (5 Pcs)', actualPrice: 200.00, per: '1 Box' },
  { _id: '144', sno: 144, productType: 'CHILDRENS FANCY', name: 'Super Dulex', actualPrice: 400.00, per: '1 Box' },
  { _id: '145', sno: 145, productType: 'CHILDRENS FANCY', name: 'Pokemon Queen 10-in-1 (Laptop)', actualPrice: 750.00, per: '1 Box' },
  { _id: '146', sno: 146, productType: 'CHILDRENS FANCY', name: 'Whistle Siren Gun', actualPrice: 280.00, per: '1 Box' },
  { _id: '147', sno: 147, productType: 'CHILDRENS FANCY', name: 'Colour Smoke (3 Pcs)', actualPrice: 240.00, per: '1 Box' },
  { _id: '148', sno: 148, productType: 'CHILDRENS FANCY', name: 'Emoji Fun Pops', actualPrice: 90.00, per: '1 Box' },
  { _id: '149', sno: 149, productType: 'CHILDRENS FANCY', name: 'Golden Butterfly', actualPrice: 180.00, per: '1 Box' },
  { _id: '150', sno: 150, productType: 'CHILDRENS FANCY', name: 'Helicopter Drone (5 Pcs)', actualPrice: 320.00, per: '1 Box' },
  { _id: '151', sno: 151, productType: 'CAPS & SERPENT', name: 'Roll Caps (10 Rolls)', actualPrice: 450.00, per: '1 Box' },
  { _id: '152', sno: 152, productType: 'CAPS & SERPENT', name: 'Black Serpent (1 Dozen)', actualPrice: 250.00, per: '1 Box' },
  { _id: '153', sno: 153, productType: 'CAPS & SERPENT', name: 'Ring Caps Deluxe', actualPrice: 160.00, per: '1 Box' },
  { _id: '154', sno: 154, productType: 'CAPS & SERPENT', name: 'Toy Gun Metal Heavy', actualPrice: 350.00, per: '1 Pce' },
  { _id: '155', sno: 155, productType: 'CAPS & SERPENT', name: 'Magic Serpent Egg', actualPrice: 120.00, per: '1 Box' },
  { _id: '156', sno: 156, productType: 'GIFT BOXES', name: 'Diwali Sparkle Gift Box (18 Items)', actualPrice: 450.00, per: '1 Box' },
  { _id: '157', sno: 157, productType: 'GIFT BOXES', name: 'Family Festive Delight Box (28 Items)', actualPrice: 850.00, per: '1 Box' },
  { _id: '158', sno: 158, productType: 'GIFT BOXES', name: '20 Items Gift Box', actualPrice: 1250.00, per: '1 Box' },
  { _id: '159', sno: 159, productType: 'GIFT BOXES', name: 'Royal Premium VIP Gift Box (42 Items)', actualPrice: 1650.00, per: '1 Box' },
  { _id: '160', sno: 160, productType: 'GIFT BOXES', name: '30 Items Gift Box', actualPrice: 1750.00, per: '1 Box' },
  { _id: '161', sno: 161, productType: 'GIFT BOXES', name: '40 Items Gift Box', actualPrice: 2750.00, per: '1 Box' },
  { _id: '162', sno: 162, productType: 'GIFT BOXES', name: 'Grand Emperor Celebration Box (55 Items)', actualPrice: 2800.00, per: '1 Box' },
  { _id: '163', sno: 163, productType: 'GIFT BOXES', name: '50 Items Gift Box', actualPrice: 3750.00, per: '1 Box' },
  { _id: '164', sno: 164, productType: 'GIFT BOXES', name: 'Supreme Diamond Mega Hamper (72 Items)', actualPrice: 4500.00, per: '1 Box' },
  { _id: '165', sno: 165, productType: 'GIFT BOXES', name: 'Royal Gold Hamper (85 Items)', actualPrice: 6500.00, per: '1 Box' },
  { _id: '166', sno: 166, productType: 'GIFT BOXES', name: 'VIP Grand Titanium Box (100 Items)', actualPrice: 9500.00, per: '1 Box' },
  { _id: '167', sno: 167, productType: 'GIFT BOXES', name: 'Imperial Luxury Gala Box (125 Items)', actualPrice: 14500.00, per: '1 Box' }
];

// Routes

// 1. Health check / Root
app.get(['/', '/api', '/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'Selvaganapathy Fireworks All-in-One API',
    database: isConnected ? 'connected' : 'connecting/ready',
    timestamp: new Date().toISOString()
  });
});

// 2. GET /products or /api/products
app.get(['/products', '/api/products'], async (req, res) => {
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      const dbProducts = await Product.find().select('-imageData').lean().exec();
      if (dbProducts && dbProducts.length > 0) {
        return res.json(dbProducts);
      }
    }
  } catch (err) {
    console.warn('DB read fallback:', err.message);
  }
  return res.json(FALLBACK_PRODUCTS);
});

// 3. POST /products or /api/products
app.post(['/products', '/api/products'], upload.single('image'), async (req, res) => {
  try {
    await connectDB();
    const productData = { ...req.body };
    if (req.file) {
      productData.imageData = req.file.buffer;
      productData.imageType = req.file.mimetype;
      productData.imageName = req.file.originalname;
    }
    const newProduct = new Product(productData);
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. PUT /products/:id or /api/products/:id
app.put(['/products/:id', '/api/products/:id'], upload.single('image'), async (req, res) => {
  try {
    await connectDB();
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageData = req.file.buffer;
      updateData.imageType = req.file.mimetype;
      updateData.imageName = req.file.originalname;
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-imageData');
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 5. DELETE /products/:id or /api/products/:id
app.delete(['/products/:id', '/api/products/:id'], async (req, res) => {
  try {
    await connectDB();
    const deleted = await Product.findByIdAndDelete(req.params.id).select('-imageData');
    return res.json(deleted);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 6. POST /mail/send-pdf or /api/mail/send-pdf
app.post(['/mail/send-pdf', '/api/mail/send-pdf'], upload.single('file'), async (req, res) => {
  try {
    const { email } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const transporter = createTransporter();
    const defaultShopkeeperEmails = ['selvaganapathytraders@gmail.com', 'sudali599@gmail.com'];
    const customEmail = process.env.SHOPKEEPER_EMAIL;
    const recipients = customEmail ? Array.from(new Set([...defaultShopkeeperEmails, customEmail])) : defaultShopkeeperEmails;

    if (email && !recipients.includes(email)) {
      recipients.push(email);
    }

    const mailOptions = {
      from: `"Selvaganapathy Fireworks" <${process.env.SENDER_EMAIL || 'sudali599@gmail.com'}>`,
      to: recipients.join(', '),
      subject: `Order PDF Estimate - Selvaganapathy Traders`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e1b4b, #831843); padding: 20px; text-align: center; border-radius: 8px; color: white;">
            <h1 style="margin: 0; font-size: 22px; color: #fde047;">SELVAGANAPATHY TRADERS</h1>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #fbcfe8;">Sun Flag Fireworks, Sivakasi</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-top: 15px;">
            <h2 style="color: #0f172a; margin-top: 0;">New Order Estimate Attached</h2>
            <p style="color: #475569; line-height: 1.5;">
              A purchase estimate has been registered. The formal estimate PDF is attached to this email.
            </p>
            <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #059669; margin: 15px 0;">
              <p style="margin: 0; color: #334155; font-size: 13px;">
                <strong>Generated Date:</strong> ${new Date().toLocaleDateString('en-IN')}<br>
                <strong>Helpline:</strong> +91 6383144854 / +91 99440 87728
              </p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: file.originalname || 'estimate.pdf',
          content: file.buffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Mail sending error:', err);
    return res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
});

// 7. POST /mail/send-order or /api/mail/send-order
app.post(['/mail/send-order', '/api/mail/send-order'], async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData || !orderData.cartItems || orderData.cartItems.length === 0) {
      return res.status(400).json({ message: 'Order data and items are required' });
    }

    const transporter = createTransporter();
    const defaultShopkeeperEmails = ['selvaganapathytraders@gmail.com', 'sudali599@gmail.com'];
    const customEmail = process.env.SHOPKEEPER_EMAIL;
    const recipients = customEmail ? Array.from(new Set([...defaultShopkeeperEmails, customEmail])) : defaultShopkeeperEmails;

    if (orderData.customer?.email && orderData.customer.email.trim() && !recipients.includes(orderData.customer.email.trim())) {
      recipients.push(orderData.customer.email.trim());
    }

    const itemsHtml = (orderData.cartItems || []).map((item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px; font-size: 12px; text-align: center;">${item.id || '-'}</td>
        <td style="padding: 8px; font-size: 12px; font-weight: bold; color: #0f172a;">${item.name}</td>
        <td style="padding: 8px; font-size: 12px; color: #64748b;">${item.category || ''}</td>
        <td style="padding: 8px; font-size: 12px; text-align: center;">${item.per || '1 Pkt'}</td>
        <td style="padding: 8px; font-size: 12px; text-align: right;">₹${Number(item.price).toFixed(2)}</td>
        <td style="padding: 8px; font-size: 12px; text-align: center; font-weight: bold;">${item.qty}</td>
        <td style="padding: 8px; font-size: 12px; text-align: right; font-weight: bold; color: #059669;">₹${Number(item.itemTotal).toFixed(2)}</td>
      </tr>
    `).join('');

    const cust = orderData.customer || {};

    const mailOptions = {
      from: `"Selvaganapathy Fireworks" <${process.env.SENDER_EMAIL || 'sudali599@gmail.com'}>`,
      to: recipients.join(', '),
      subject: `Order Confirmation [${orderData.orderNo || 'SGT-2026'}] - ₹${Number(orderData.grandTotal || 0).toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #1e1b4b 0%, #4c0519 100%); padding: 24px; text-align: center; border-radius: 12px; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #fde047;">SELVAGANAPATHY TRADERS</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #fbcfe8; font-weight: bold;">SUN FLAG FIREWORKS &amp; SPARKLERS • SIVAKASI</p>
          </div>

          <div style="background-color: white; padding: 24px; border-radius: 12px; margin-top: 15px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">Order Details (#${orderData.orderNo || 'SGT-2026'})</h2>
            <p style="color: #475569; font-size: 13px;">Customer: <strong>${cust.name || 'Customer'}</strong> (${cust.phone || '-'})</p>
            <p style="color: #475569; font-size: 13px;">Address: ${cust.address || '-'}, ${cust.city || '-'}, ${cust.state || '-'} - ${cust.pincode || '-'}</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background-color: #f1f5f9; text-align: left;">
                  <th style="padding: 8px; font-size: 12px;">S.No</th>
                  <th style="padding: 8px; font-size: 12px;">Product</th>
                  <th style="padding: 8px; font-size: 12px;">Category</th>
                  <th style="padding: 8px; font-size: 12px;">Per</th>
                  <th style="padding: 8px; font-size: 12px; text-align: right;">Rate</th>
                  <th style="padding: 8px; font-size: 12px; text-align: center;">Qty</th>
                  <th style="padding: 8px; font-size: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding: 15px; background-color: #f0fdf4; border-radius: 8px; text-align: right;">
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #166534;">
                Grand Total: ₹${Number(orderData.grandTotal || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: 'Order confirmation and receipt successfully dispatched', orderNo: orderData.orderNo });
  } catch (err) {
    console.error('Order dispatch error:', err);
    return res.status(500).json({ message: 'Failed to dispatch order email', error: err.message });
  }
});

// 8. POST /mail/send-otp and verify-otp
app.post(['/mail/send-otp', '/api/mail/send-otp'], async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    otpStore.set(email.toLowerCase().trim(), { otp, expiresAt });

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Selvaganapathy Fireworks" <${process.env.SENDER_EMAIL || 'sudali599@gmail.com'}>`,
      to: email,
      subject: `Your OTP Code - Selvaganapathy Traders`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2>Your Verification Code</h2>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #4338ca;">${otp}</p>
          <p style="color: #64748b;">This OTP is valid for 10 minutes.</p>
        </div>
      `
    });

    return res.json({ message: 'OTP sent successfully', email });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

app.post(['/mail/verify-otp', '/api/mail/verify-otp'], async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const record = otpStore.get(email.toLowerCase().trim());
  if (record && record.otp === otp.trim() && new Date() < record.expiresAt) {
    otpStore.delete(email.toLowerCase().trim());
    return res.json({ message: 'OTP verified successfully', verified: true });
  }
  return res.status(401).json({ message: 'Invalid or expired OTP', verified: false });
});

module.exports = app;
