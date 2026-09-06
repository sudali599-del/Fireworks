import React, { useState, useEffect } from "react";
import CrackersCartTable from "./CrackersCartTable.jsx";
import Footer from "./Footer.jsx";
import FireworksBackground from "./FireworksBackground.jsx";
import { ShoppingCart, ShoppingBag, X, Sparkles, Phone, Download, Flame } from "lucide-react";

const INITIAL_PRODUCTS = [
  {
    "_id": "1",
    "sno": 1,
    "productType": "ONE SOUND CRACKERS",
    "name": "2 3/4\" Kuruvi",
    "actualPrice": 12,
    "per": "1 Pkt"
  },
  {
    "_id": "2",
    "sno": 2,
    "productType": "ONE SOUND CRACKERS",
    "name": "3 1/2\" Lakshmi",
    "actualPrice": 20,
    "per": "1 Pkt"
  },
  {
    "_id": "3",
    "sno": 3,
    "productType": "ONE SOUND CRACKERS",
    "name": "4\" Lakshmi",
    "actualPrice": 26,
    "per": "1 Pkt"
  },
  {
    "_id": "4",
    "sno": 4,
    "productType": "ONE SOUND CRACKERS",
    "name": "4\" Deluxe Lakshmi",
    "actualPrice": 38,
    "per": "1 Pkt"
  },
  {
    "_id": "5",
    "sno": 5,
    "productType": "ONE SOUND CRACKERS",
    "name": "4\" Gold Lakshmi",
    "actualPrice": 42,
    "per": "1 Pkt"
  },
  {
    "_id": "6",
    "sno": 6,
    "productType": "ONE SOUND CRACKERS",
    "name": "4\" Super Deluxe",
    "actualPrice": 46,
    "per": "1 Pkt"
  },
  {
    "_id": "7",
    "sno": 7,
    "productType": "ONE SOUND CRACKERS",
    "name": "5\" Mega Deluxe",
    "actualPrice": 65,
    "per": "1 Pkt"
  },
  {
    "_id": "8",
    "sno": 8,
    "productType": "ONE SOUND CRACKERS",
    "name": "6\" Super Sound",
    "actualPrice": 85,
    "per": "1 Pkt"
  },
  {
    "_id": "9",
    "sno": 9,
    "productType": "FLOWER POTS",
    "name": "Flower Pots Big",
    "actualPrice": 110,
    "per": "1 Box"
  },
  {
    "_id": "10",
    "sno": 10,
    "productType": "FLOWER POTS",
    "name": "Flower Pots Special",
    "actualPrice": 160,
    "per": "1 Box"
  },
  {
    "_id": "11",
    "sno": 11,
    "productType": "FLOWER POTS",
    "name": "Flower Pots Asoka",
    "actualPrice": 220,
    "per": "1 Box"
  },
  {
    "_id": "12",
    "sno": 12,
    "productType": "FLOWER POTS",
    "name": "Flower Pots Deluxe",
    "actualPrice": 280,
    "per": "1 Box"
  },
  {
    "_id": "13",
    "sno": 13,
    "productType": "FLOWER POTS",
    "name": "Colour Koti",
    "actualPrice": 340,
    "per": "1 Box"
  },
  {
    "_id": "14",
    "sno": 14,
    "productType": "FLOWER POTS",
    "name": "Flower Pots Super Jumbo",
    "actualPrice": 450,
    "per": "1 Box"
  },
  {
    "_id": "15",
    "sno": 15,
    "productType": "GROUND CHAKKAR",
    "name": "Ground Chakkar Big (10 Pcs)",
    "actualPrice": 70,
    "per": "1 Box"
  },
  {
    "_id": "16",
    "sno": 16,
    "productType": "GROUND CHAKKAR",
    "name": "Ground Chakkar Special (10 Pcs)",
    "actualPrice": 120,
    "per": "1 Box"
  },
  {
    "_id": "17",
    "sno": 17,
    "productType": "GROUND CHAKKAR",
    "name": "Ground Chakkar Deluxe (10 Pcs)",
    "actualPrice": 180,
    "per": "1 Box"
  },
  {
    "_id": "18",
    "sno": 18,
    "productType": "GROUND CHAKKAR",
    "name": "Spinner / Wheel Supreme (10 Pcs)",
    "actualPrice": 240,
    "per": "1 Box"
  },
  {
    "_id": "19",
    "sno": 19,
    "productType": "GROUND CHAKKAR",
    "name": "Whistling Wheel Deluxe (5 Pcs)",
    "actualPrice": 260,
    "per": "1 Box"
  },
  {
    "_id": "20",
    "sno": 20,
    "productType": "ROCKETS",
    "name": "Baby Rocket (10 Pcs)",
    "actualPrice": 90,
    "per": "1 Box"
  },
  {
    "_id": "21",
    "sno": 21,
    "productType": "ROCKETS",
    "name": "Rocket Bomb (10 Pcs)",
    "actualPrice": 140,
    "per": "1 Box"
  },
  {
    "_id": "22",
    "sno": 22,
    "productType": "ROCKETS",
    "name": "Lunik Rocket Sound (10 Pcs)",
    "actualPrice": 190,
    "per": "1 Box"
  },
  {
    "_id": "23",
    "sno": 23,
    "productType": "ROCKETS",
    "name": "Whistling Rocket (10 Pcs)",
    "actualPrice": 250,
    "per": "1 Box"
  },
  {
    "_id": "24",
    "sno": 24,
    "productType": "ROCKETS",
    "name": "Parachute Rocket with Light (5 Pcs)",
    "actualPrice": 320,
    "per": "1 Box"
  },
  {
    "_id": "25",
    "sno": 25,
    "productType": "TWINKLING STAR",
    "name": "1 1/2\" Twinkling Star",
    "actualPrice": 50,
    "per": "1 Box"
  },
  {
    "_id": "26",
    "sno": 26,
    "productType": "TWINKLING STAR",
    "name": "4\" Twinkling Star Deluxe",
    "actualPrice": 120,
    "per": "1 Box"
  },
  {
    "_id": "27",
    "sno": 27,
    "productType": "TWINKLING STAR",
    "name": "Star Light Twinklers",
    "actualPrice": 160,
    "per": "1 Box"
  },
  {
    "_id": "28",
    "sno": 28,
    "productType": "ELECTRIC CRACKERS",
    "name": "28 Chorsa Special",
    "actualPrice": 45,
    "per": "1 Pkt"
  },
  {
    "_id": "29",
    "sno": 29,
    "productType": "ELECTRIC CRACKERS",
    "name": "28 Giant Crackers",
    "actualPrice": 75,
    "per": "1 Pkt"
  },
  {
    "_id": "30",
    "sno": 30,
    "productType": "ELECTRIC CRACKERS",
    "name": "56 Giant Crackers",
    "actualPrice": 150,
    "per": "1 Pkt"
  },
  {
    "_id": "31",
    "sno": 31,
    "productType": "ELECTRIC CRACKERS",
    "name": "28 Deluxe Crackers",
    "actualPrice": 90,
    "per": "1 Pkt"
  },
  {
    "_id": "32",
    "sno": 32,
    "productType": "ELECTRIC CRACKERS",
    "name": "56 Deluxe Crackers",
    "actualPrice": 180,
    "per": "1 Pkt"
  },
  {
    "_id": "33",
    "sno": 33,
    "productType": "DELUXE CRACKERS",
    "name": "24 Deluxe Sound",
    "actualPrice": 110,
    "per": "1 Box"
  },
  {
    "_id": "34",
    "sno": 34,
    "productType": "DELUXE CRACKERS",
    "name": "50 Deluxe Sound",
    "actualPrice": 220,
    "per": "1 Box"
  },
  {
    "_id": "35",
    "sno": 35,
    "productType": "DELUXE CRACKERS",
    "name": "100 Deluxe Sound",
    "actualPrice": 420,
    "per": "1 Box"
  },
  {
    "_id": "36",
    "sno": 36,
    "productType": "DELUXE CRACKERS",
    "name": "Classic Gold Sound",
    "actualPrice": 260,
    "per": "1 Box"
  },
  {
    "_id": "37",
    "sno": 37,
    "productType": "SPECIAL GARLANDS",
    "name": "100 Wala Special Garland",
    "actualPrice": 65,
    "per": "1 Box"
  },
  {
    "_id": "38",
    "sno": 38,
    "productType": "SPECIAL GARLANDS",
    "name": "200 Wala Festive Garland",
    "actualPrice": 130,
    "per": "1 Box"
  },
  {
    "_id": "39",
    "sno": 39,
    "productType": "SPECIAL GARLANDS",
    "name": "300 Wala Grand Garland",
    "actualPrice": 195,
    "per": "1 Box"
  },
  {
    "_id": "40",
    "sno": 40,
    "productType": "SPECIAL GARLANDS",
    "name": "1000 Wala Heavy Garland",
    "actualPrice": 380,
    "per": "1 Box"
  },
  {
    "_id": "41",
    "sno": 41,
    "productType": "SPECIAL GARLANDS",
    "name": "2000 Wala Long Garland",
    "actualPrice": 750,
    "per": "1 Box"
  },
  {
    "_id": "42",
    "sno": 42,
    "productType": "SPECIAL GARLANDS",
    "name": "5000 Wala Celebration Garland",
    "actualPrice": 1850,
    "per": "1 Box"
  },
  {
    "_id": "43",
    "sno": 43,
    "productType": "SPECIAL GARLANDS",
    "name": "10000 Wala Mega Garland",
    "actualPrice": 3600,
    "per": "1 Box"
  },
  {
    "_id": "44",
    "sno": 44,
    "productType": "BIJILI",
    "name": "Red Bijili Stripped (50 Pcs)",
    "actualPrice": 38,
    "per": "1 Bag"
  },
  {
    "_id": "45",
    "sno": 45,
    "productType": "BIJILI",
    "name": "Red Bijili Stripped (100 Pcs)",
    "actualPrice": 75,
    "per": "1 Bag"
  },
  {
    "_id": "46",
    "sno": 46,
    "productType": "BIJILI",
    "name": "Silver Streak Bijili (100 Pcs)",
    "actualPrice": 85,
    "per": "1 Bag"
  },
  {
    "_id": "47",
    "sno": 47,
    "productType": "BOMBS",
    "name": "Classic Bullet Bomb",
    "actualPrice": 60,
    "per": "1 Box"
  },
  {
    "_id": "48",
    "sno": 48,
    "productType": "BOMBS",
    "name": "Hydro Bomb Green",
    "actualPrice": 95,
    "per": "1 Box"
  },
  {
    "_id": "49",
    "sno": 49,
    "productType": "BOMBS",
    "name": "King of King Bomb",
    "actualPrice": 130,
    "per": "1 Box"
  },
  {
    "_id": "50",
    "sno": 50,
    "productType": "BOMBS",
    "name": "Agni Bomb Heavy",
    "actualPrice": 150,
    "per": "1 Box"
  },
  {
    "_id": "51",
    "sno": 51,
    "productType": "BOMBS",
    "name": "Digital Bomb / Paper Bomb",
    "actualPrice": 180,
    "per": "1 Box"
  },
  {
    "_id": "52",
    "sno": 52,
    "productType": "BOMBS",
    "name": "Thunder Blast Bomb",
    "actualPrice": 210,
    "per": "1 Box"
  },
  {
    "_id": "53",
    "sno": 53,
    "productType": "BOMBS",
    "name": "Mega Volcano Bomb",
    "actualPrice": 240,
    "per": "1 Box"
  },
  {
    "_id": "54",
    "sno": 54,
    "productType": "PENCIL",
    "name": "Poplar Candle Pencil (3 Pcs)",
    "actualPrice": 90,
    "per": "1 Box"
  },
  {
    "_id": "55",
    "sno": 55,
    "productType": "PENCIL",
    "name": "Colour Candle Deluxe (3 Pcs)",
    "actualPrice": 140,
    "per": "1 Box"
  },
  {
    "_id": "56",
    "sno": 56,
    "productType": "PENCIL",
    "name": "Magic Stick Pencil (5 Pcs)",
    "actualPrice": 160,
    "per": "1 Box"
  },
  {
    "_id": "57",
    "sno": 57,
    "productType": "PENCIL",
    "name": "Rainbow Pencil Giant",
    "actualPrice": 220,
    "per": "1 Box"
  },
  {
    "_id": "58",
    "sno": 58,
    "productType": "SPARKLERS",
    "name": "7cm Electric Sparklers",
    "actualPrice": 22,
    "per": "1 Box"
  },
  {
    "_id": "59",
    "sno": 59,
    "productType": "SPARKLERS",
    "name": "7cm Colour Sparklers",
    "actualPrice": 26,
    "per": "1 Box"
  },
  {
    "_id": "60",
    "sno": 60,
    "productType": "SPARKLERS",
    "name": "7cm Green Sparklers",
    "actualPrice": 30,
    "per": "1 Box"
  },
  {
    "_id": "61",
    "sno": 61,
    "productType": "SPARKLERS",
    "name": "7cm Red Sparklers",
    "actualPrice": 32,
    "per": "1 Box"
  },
  {
    "_id": "62",
    "sno": 62,
    "productType": "SPARKLERS",
    "name": "10cm Electric Sparklers",
    "actualPrice": 42,
    "per": "1 Box"
  },
  {
    "_id": "63",
    "sno": 63,
    "productType": "SPARKLERS",
    "name": "10cm Colour Sparklers",
    "actualPrice": 48,
    "per": "1 Box"
  },
  {
    "_id": "64",
    "sno": 64,
    "productType": "SPARKLERS",
    "name": "10cm Green Sparklers",
    "actualPrice": 54,
    "per": "1 Box"
  },
  {
    "_id": "65",
    "sno": 65,
    "productType": "SPARKLERS",
    "name": "10cm Red Sparklers",
    "actualPrice": 58,
    "per": "1 Box"
  },
  {
    "_id": "66",
    "sno": 66,
    "productType": "SPARKLERS",
    "name": "12cm Electric Sparklers",
    "actualPrice": 65,
    "per": "1 Box"
  },
  {
    "_id": "67",
    "sno": 67,
    "productType": "SPARKLERS",
    "name": "12cm Colour Sparklers",
    "actualPrice": 72,
    "per": "1 Box"
  },
  {
    "_id": "68",
    "sno": 68,
    "productType": "SPARKLERS",
    "name": "15cm Electric Sparklers",
    "actualPrice": 95,
    "per": "1 Box"
  },
  {
    "_id": "69",
    "sno": 69,
    "productType": "SPARKLERS",
    "name": "15cm Colour Sparklers",
    "actualPrice": 110,
    "per": "1 Box"
  },
  {
    "_id": "70",
    "sno": 70,
    "productType": "SPARKLERS",
    "name": "30cm Electric Sparklers (5 in 1)",
    "actualPrice": 180,
    "per": "1 Box"
  },
  {
    "_id": "71",
    "sno": 71,
    "productType": "SPARKLERS",
    "name": "30cm Colour Sparklers (5 in 1)",
    "actualPrice": 195,
    "per": "1 Box"
  },
  {
    "_id": "72",
    "sno": 72,
    "productType": "SPARKLERS",
    "name": "50cm Mega Giant Sparklers",
    "actualPrice": 360,
    "per": "1 Box"
  },
  {
    "_id": "73",
    "sno": 73,
    "productType": "FANCY FOUNTAINS",
    "name": "Colour Rain Fountain (5 Pcs)",
    "actualPrice": 450,
    "per": "1 Box"
  },
  {
    "_id": "74",
    "sno": 74,
    "productType": "FANCY FOUNTAINS",
    "name": "Golden Globe (5 Pcs)",
    "actualPrice": 450,
    "per": "1 Box"
  },
  {
    "_id": "75",
    "sno": 75,
    "productType": "FANCY FOUNTAINS",
    "name": "Lotus Fountain (3 Pcs)",
    "actualPrice": 550,
    "per": "1 Box"
  },
  {
    "_id": "76",
    "sno": 76,
    "productType": "FANCY FOUNTAINS",
    "name": "Tweet Poppings 6000",
    "actualPrice": 575,
    "per": "1 Box"
  },
  {
    "_id": "77",
    "sno": 77,
    "productType": "FANCY FOUNTAINS",
    "name": "Trix / Goodly / Minions (3 Pcs)",
    "actualPrice": 700,
    "per": "1 Box"
  },
  {
    "_id": "78",
    "sno": 78,
    "productType": "FANCY FOUNTAINS",
    "name": "Twix Magic Fountain (5 Pcs)",
    "actualPrice": 700,
    "per": "1 Box"
  },
  {
    "_id": "79",
    "sno": 79,
    "productType": "FANCY FOUNTAINS",
    "name": "Sun Feast Fountain (5 Pcs)",
    "actualPrice": 750,
    "per": "1 Box"
  },
  {
    "_id": "80",
    "sno": 80,
    "productType": "FANCY FOUNTAINS",
    "name": "Power Pot Fountain (5 Pcs)",
    "actualPrice": 900,
    "per": "1 Box"
  },
  {
    "_id": "81",
    "sno": 81,
    "productType": "FANCY FOUNTAINS",
    "name": "Wonder 3 in 1 Crackling",
    "actualPrice": 1050,
    "per": "1 Box"
  },
  {
    "_id": "82",
    "sno": 82,
    "productType": "FANCY FOUNTAINS",
    "name": "Angry Bird Special Fountain",
    "actualPrice": 1350,
    "per": "1 Box"
  },
  {
    "_id": "83",
    "sno": 83,
    "productType": "MUSICAL ITEMS",
    "name": "Siren / Whistle King (5 Pcs)",
    "actualPrice": 220,
    "per": "1 Box"
  },
  {
    "_id": "84",
    "sno": 84,
    "productType": "MUSICAL ITEMS",
    "name": "Musical Wheel Spinner",
    "actualPrice": 260,
    "per": "1 Box"
  },
  {
    "_id": "85",
    "sno": 85,
    "productType": "MUSICAL ITEMS",
    "name": "Whistling Jumbo Fountain",
    "actualPrice": 380,
    "per": "1 Box"
  },
  {
    "_id": "86",
    "sno": 86,
    "productType": "MUSICAL ITEMS",
    "name": "Dancing Peacock Musical",
    "actualPrice": 480,
    "per": "1 Box"
  },
  {
    "_id": "87",
    "sno": 87,
    "productType": "MUSICAL ITEMS",
    "name": "Musical Thunder Bomb (3 Pcs)",
    "actualPrice": 320,
    "per": "1 Box"
  },
  {
    "_id": "88",
    "sno": 88,
    "productType": "MUSICAL ITEMS",
    "name": "Symphony Aerial Whistle",
    "actualPrice": 550,
    "per": "1 Box"
  },
  {
    "_id": "89",
    "sno": 89,
    "productType": "AERIAL FANCY",
    "name": "1 1/4\" Chotta Shot Single",
    "actualPrice": 175,
    "per": "1 Box"
  },
  {
    "_id": "90",
    "sno": 90,
    "productType": "AERIAL FANCY",
    "name": "2\" Pipe Single Shot (3 Pcs)",
    "actualPrice": 1050,
    "per": "1 Box"
  },
  {
    "_id": "91",
    "sno": 91,
    "productType": "AERIAL FANCY",
    "name": "2 1/2\" Pipe Royal Fancy",
    "actualPrice": 650,
    "per": "1 Box"
  },
  {
    "_id": "92",
    "sno": 92,
    "productType": "AERIAL FANCY",
    "name": "3\" Color Pipe Fancy Shot",
    "actualPrice": 1250,
    "per": "1 Box"
  },
  {
    "_id": "93",
    "sno": 93,
    "productType": "AERIAL FANCY",
    "name": "3 1/2\" Color Pipe Fancy Shot",
    "actualPrice": 1350,
    "per": "1 Box"
  },
  {
    "_id": "94",
    "sno": 94,
    "productType": "AERIAL FANCY",
    "name": "3 1/2\" Seven Step Pipe Fancy",
    "actualPrice": 1600,
    "per": "1 Box"
  },
  {
    "_id": "95",
    "sno": 95,
    "productType": "AERIAL FANCY",
    "name": "4\" Colour Pipe Fancy Shot",
    "actualPrice": 1400,
    "per": "1 Box"
  },
  {
    "_id": "96",
    "sno": 96,
    "productType": "AERIAL FANCY",
    "name": "4\" Niagara Falls Mega Shot",
    "actualPrice": 1500,
    "per": "1 Box"
  },
  {
    "_id": "97",
    "sno": 97,
    "productType": "AERIAL FANCY SHOTS",
    "name": "7 Shots Sky Thunder (5 Pcs)",
    "actualPrice": 350,
    "per": "1 Box"
  },
  {
    "_id": "98",
    "sno": 98,
    "productType": "AERIAL FANCY SHOTS",
    "name": "12 Shots Multi Spectacular",
    "actualPrice": 750,
    "per": "1 Box"
  },
  {
    "_id": "99",
    "sno": 99,
    "productType": "AERIAL FANCY SHOTS",
    "name": "15 Shots Sky Rider",
    "actualPrice": 950,
    "per": "1 Box"
  },
  {
    "_id": "100",
    "sno": 100,
    "productType": "AERIAL FANCY SHOTS",
    "name": "30 Shots Sky Show",
    "actualPrice": 2100,
    "per": "1 Box"
  },
  {
    "_id": "101",
    "sno": 101,
    "productType": "AERIAL FANCY SHOTS",
    "name": "60 Shots Mega Celebration",
    "actualPrice": 4200,
    "per": "1 Box"
  },
  {
    "_id": "102",
    "sno": 102,
    "productType": "AERIAL FANCY SHOTS",
    "name": "120 Shots Royal Extravaganza",
    "actualPrice": 8400,
    "per": "1 Box"
  },
  {
    "_id": "103",
    "sno": 103,
    "productType": "AERIAL FANCY SHOTS",
    "name": "240 Shots Grand Finale Show",
    "actualPrice": 16800,
    "per": "1 Box"
  },
  {
    "_id": "104",
    "sno": 104,
    "productType": "AERIAL FANCY SHOTS",
    "name": "500 Shots Ultra Royal Gala",
    "actualPrice": 32000,
    "per": "1 Box"
  },
  {
    "_id": "105",
    "sno": 105,
    "productType": "AERIAL MULTI SHOTS FANCY",
    "name": "12 Shots Color Pearl",
    "actualPrice": 550,
    "per": "1 Box"
  },
  {
    "_id": "106",
    "sno": 106,
    "productType": "AERIAL MULTI SHOTS FANCY",
    "name": "25 Shots Golden Willow",
    "actualPrice": 1350,
    "per": "1 Box"
  },
  {
    "_id": "107",
    "sno": 107,
    "productType": "AERIAL MULTI SHOTS FANCY",
    "name": "50 Shots Glittering Brocade",
    "actualPrice": 2800,
    "per": "1 Box"
  },
  {
    "_id": "108",
    "sno": 108,
    "productType": "AERIAL MULTI SHOTS FANCY",
    "name": "100 Shots Multi Colour Magic",
    "actualPrice": 5400,
    "per": "1 Box"
  },
  {
    "_id": "109",
    "sno": 109,
    "productType": "AERIAL MULTI SHOTS FANCY",
    "name": "150 Shots Night Queen Star",
    "actualPrice": 8200,
    "per": "1 Box"
  },
  {
    "_id": "110",
    "sno": 110,
    "productType": "AERIAL MULTI SHOTS FANCY",
    "name": "300 Shots Emperor Sovereign",
    "actualPrice": 19500,
    "per": "1 Box"
  },
  {
    "_id": "111",
    "sno": 111,
    "productType": "SPECIAL FANCY FOUNTAIN",
    "name": "Gold Feast, Red Sun & Blue Ice (5 Pcs)",
    "actualPrice": 800,
    "per": "1 Box"
  },
  {
    "_id": "112",
    "sno": 112,
    "productType": "SPECIAL FANCY FOUNTAIN",
    "name": "Croods / Angel Time / GoldFish",
    "actualPrice": 750,
    "per": "1 Box"
  },
  {
    "_id": "113",
    "sno": 113,
    "productType": "SPECIAL FANCY FOUNTAIN",
    "name": "Money Bank Millionaire (2 Pcs)",
    "actualPrice": 900,
    "per": "1 Box"
  },
  {
    "_id": "114",
    "sno": 114,
    "productType": "SPECIAL FANCY FOUNTAIN",
    "name": "Pom Pom Fountain (30 Pcs)",
    "actualPrice": 1050,
    "per": "1 Box"
  },
  {
    "_id": "115",
    "sno": 115,
    "productType": "SPECIAL FANCY FOUNTAIN",
    "name": "Rope Colour Fountain (4 Pcs)",
    "actualPrice": 1000,
    "per": "1 Box"
  },
  {
    "_id": "116",
    "sno": 116,
    "productType": "SPECIAL FANCY FOUNTAIN",
    "name": "Touch Me Falls Fountain",
    "actualPrice": 700,
    "per": "1 Box"
  },
  {
    "_id": "117",
    "sno": 117,
    "productType": "SPECIAL FANCY FOUNTAIN",
    "name": "Carnival / Tweet Bird / Bingo (3 Pcs)",
    "actualPrice": 600,
    "per": "1 Box"
  },
  {
    "_id": "118",
    "sno": 118,
    "productType": "SPECIAL FANCY FOUNTAIN",
    "name": "Colour Gems Fountain",
    "actualPrice": 550,
    "per": "1 Box"
  },
  {
    "_id": "119",
    "sno": 119,
    "productType": "SPECIAL FANCY FOUNTAIN",
    "name": "Silver Smoke Screen",
    "actualPrice": 420,
    "per": "1 Box"
  },
  {
    "_id": "120",
    "sno": 120,
    "productType": "SPECIAL FANCY FOUNTAIN",
    "name": "Golden Shower Cascade",
    "actualPrice": 680,
    "per": "1 Box"
  },
  {
    "_id": "121",
    "sno": 121,
    "productType": "SPECIAL FOUNTAINS",
    "name": "Magical Pots (5 Pcs)",
    "actualPrice": 1000,
    "per": "1 Box"
  },
  {
    "_id": "122",
    "sno": 122,
    "productType": "SPECIAL FOUNTAINS",
    "name": "Diamond Bursters (5 Pcs)",
    "actualPrice": 750,
    "per": "1 Box"
  },
  {
    "_id": "123",
    "sno": 123,
    "productType": "SPECIAL FOUNTAINS",
    "name": "Multi Colour Shower (5 Pcs)",
    "actualPrice": 750,
    "per": "1 Box"
  },
  {
    "_id": "124",
    "sno": 124,
    "productType": "SPECIAL FOUNTAINS",
    "name": "MRF Bat and Ball",
    "actualPrice": 1200,
    "per": "1 Pce"
  },
  {
    "_id": "125",
    "sno": 125,
    "productType": "SPECIAL FOUNTAINS",
    "name": "90 Watts",
    "actualPrice": 550,
    "per": "1 Box"
  },
  {
    "_id": "126",
    "sno": 126,
    "productType": "SPECIAL FOUNTAINS",
    "name": "H2O Falls",
    "actualPrice": 650,
    "per": "1 Box"
  },
  {
    "_id": "127",
    "sno": 127,
    "productType": "SPECIAL FOUNTAINS",
    "name": "King Fisher / Crystal Tinbeer",
    "actualPrice": 375,
    "per": "1 Box"
  },
  {
    "_id": "128",
    "sno": 128,
    "productType": "SPECIAL FOUNTAINS",
    "name": "Old is Gold",
    "actualPrice": 800,
    "per": "1 Box"
  },
  {
    "_id": "129",
    "sno": 129,
    "productType": "SPECIAL FOUNTAINS",
    "name": "Mini Rail",
    "actualPrice": 250,
    "per": "1 Box"
  },
  {
    "_id": "130",
    "sno": 130,
    "productType": "SPECIAL FOUNTAINS",
    "name": "Photo Flash (5 Pcs)",
    "actualPrice": 200,
    "per": "1 Box"
  },
  {
    "_id": "131",
    "sno": 131,
    "productType": "NEW ARRIVAL FOUNTAINS",
    "name": "I Cone (2 Pcs)",
    "actualPrice": 1000,
    "per": "1 Box"
  },
  {
    "_id": "132",
    "sno": 132,
    "productType": "NEW ARRIVAL FOUNTAINS",
    "name": "Rock Stars",
    "actualPrice": 700,
    "per": "1 No"
  },
  {
    "_id": "133",
    "sno": 133,
    "productType": "NEW ARRIVAL FOUNTAINS",
    "name": "Sizzling Star",
    "actualPrice": 950,
    "per": "1 Box"
  },
  {
    "_id": "134",
    "sno": 134,
    "productType": "NEW ARRIVAL FOUNTAINS",
    "name": "Jolly Poppy",
    "actualPrice": 2500,
    "per": "1 Box"
  },
  {
    "_id": "135",
    "sno": 135,
    "productType": "NEW ARRIVAL FOUNTAINS",
    "name": "King Version",
    "actualPrice": 900,
    "per": "1 Box"
  },
  {
    "_id": "136",
    "sno": 136,
    "productType": "NEW ARRIVAL FOUNTAINS",
    "name": "Kulfi (2 Pcs)",
    "actualPrice": 1500,
    "per": "1 Box"
  },
  {
    "_id": "137",
    "sno": 137,
    "productType": "NEW ARRIVAL FOUNTAINS",
    "name": "Galaxy Spinner Fountain",
    "actualPrice": 1100,
    "per": "1 Box"
  },
  {
    "_id": "138",
    "sno": 138,
    "productType": "CHILDRENS FANCY",
    "name": "Magic Pops",
    "actualPrice": 35,
    "per": "1 Box"
  },
  {
    "_id": "139",
    "sno": 139,
    "productType": "CHILDRENS FANCY",
    "name": "Jee Boom Baa",
    "actualPrice": 35,
    "per": "1 Box"
  },
  {
    "_id": "140",
    "sno": 140,
    "productType": "CHILDRENS FANCY",
    "name": "Electric Stone",
    "actualPrice": 40,
    "per": "1 Box"
  },
  {
    "_id": "141",
    "sno": 141,
    "productType": "CHILDRENS FANCY",
    "name": "Cartoon (5 Pcs)",
    "actualPrice": 50,
    "per": "1 Box"
  },
  {
    "_id": "142",
    "sno": 142,
    "productType": "CHILDRENS FANCY",
    "name": "Kit Kat",
    "actualPrice": 160,
    "per": "1 Box"
  },
  {
    "_id": "143",
    "sno": 143,
    "productType": "CHILDRENS FANCY",
    "name": "Asrafi Big (5 Pcs)",
    "actualPrice": 200,
    "per": "1 Box"
  },
  {
    "_id": "144",
    "sno": 144,
    "productType": "CHILDRENS FANCY",
    "name": "Super Dulex",
    "actualPrice": 400,
    "per": "1 Box"
  },
  {
    "_id": "145",
    "sno": 145,
    "productType": "CHILDRENS FANCY",
    "name": "Pokemon Queen 10-in-1 (Laptop)",
    "actualPrice": 750,
    "per": "1 Box"
  },
  {
    "_id": "146",
    "sno": 146,
    "productType": "CHILDRENS FANCY",
    "name": "Whistle Siren Gun",
    "actualPrice": 280,
    "per": "1 Box"
  },
  {
    "_id": "147",
    "sno": 147,
    "productType": "CHILDRENS FANCY",
    "name": "Colour Smoke (3 Pcs)",
    "actualPrice": 240,
    "per": "1 Box"
  },
  {
    "_id": "148",
    "sno": 148,
    "productType": "CHILDRENS FANCY",
    "name": "Emoji Fun Pops",
    "actualPrice": 90,
    "per": "1 Box"
  },
  {
    "_id": "149",
    "sno": 149,
    "productType": "CHILDRENS FANCY",
    "name": "Golden Butterfly",
    "actualPrice": 180,
    "per": "1 Box"
  },
  {
    "_id": "150",
    "sno": 150,
    "productType": "CHILDRENS FANCY",
    "name": "Helicopter Drone (5 Pcs)",
    "actualPrice": 320,
    "per": "1 Box"
  },
  {
    "_id": "151",
    "sno": 151,
    "productType": "CAPS & SERPENT",
    "name": "Roll Caps (10 Rolls)",
    "actualPrice": 450,
    "per": "1 Box"
  },
  {
    "_id": "152",
    "sno": 152,
    "productType": "CAPS & SERPENT",
    "name": "Black Serpent (1 Dozen)",
    "actualPrice": 250,
    "per": "1 Box"
  },
  {
    "_id": "153",
    "sno": 153,
    "productType": "CAPS & SERPENT",
    "name": "Ring Caps Deluxe",
    "actualPrice": 160,
    "per": "1 Box"
  },
  {
    "_id": "154",
    "sno": 154,
    "productType": "CAPS & SERPENT",
    "name": "Toy Gun Metal Heavy",
    "actualPrice": 350,
    "per": "1 Pce"
  },
  {
    "_id": "155",
    "sno": 155,
    "productType": "CAPS & SERPENT",
    "name": "Magic Serpent Egg",
    "actualPrice": 120,
    "per": "1 Box"
  },
  {
    "_id": "156",
    "sno": 156,
    "productType": "GIFT BOXES",
    "name": "Diwali Sparkle Gift Box (18 Items)",
    "actualPrice": 450,
    "per": "1 Box"
  },
  {
    "_id": "157",
    "sno": 157,
    "productType": "GIFT BOXES",
    "name": "Family Festive Delight Box (28 Items)",
    "actualPrice": 850,
    "per": "1 Box"
  },
  {
    "_id": "158",
    "sno": 158,
    "productType": "GIFT BOXES",
    "name": "20 Items Gift Box",
    "actualPrice": 1250,
    "per": "1 Box"
  },
  {
    "_id": "159",
    "sno": 159,
    "productType": "GIFT BOXES",
    "name": "Royal Premium VIP Gift Box (42 Items)",
    "actualPrice": 1650,
    "per": "1 Box"
  },
  {
    "_id": "160",
    "sno": 160,
    "productType": "GIFT BOXES",
    "name": "30 Items Gift Box",
    "actualPrice": 1750,
    "per": "1 Box"
  },
  {
    "_id": "161",
    "sno": 161,
    "productType": "GIFT BOXES",
    "name": "40 Items Gift Box",
    "actualPrice": 2750,
    "per": "1 Box"
  },
  {
    "_id": "162",
    "sno": 162,
    "productType": "GIFT BOXES",
    "name": "Grand Emperor Celebration Box (55 Items)",
    "actualPrice": 2800,
    "per": "1 Box"
  },
  {
    "_id": "163",
    "sno": 163,
    "productType": "GIFT BOXES",
    "name": "50 Items Gift Box",
    "actualPrice": 3750,
    "per": "1 Box"
  },
  {
    "_id": "164",
    "sno": 164,
    "productType": "GIFT BOXES",
    "name": "Supreme Diamond Mega Hamper (72 Items)",
    "actualPrice": 4500,
    "per": "1 Box"
  },
  {
    "_id": "165",
    "sno": 165,
    "productType": "GIFT BOXES",
    "name": "Royal Gold Hamper (85 Items)",
    "actualPrice": 6500,
    "per": "1 Box"
  },
  {
    "_id": "166",
    "sno": 166,
    "productType": "GIFT BOXES",
    "name": "VIP Grand Titanium Box (100 Items)",
    "actualPrice": 9500,
    "per": "1 Box"
  },
  {
    "_id": "167",
    "sno": 167,
    "productType": "GIFT BOXES",
    "name": "Imperial Luxury Gala Box (125 Items)",
    "actualPrice": 14500,
    "per": "1 Box"
  }
];

export default function HomePage() {
  const year = new Date().getFullYear().toString();
  const [isPressed, setIsPressed] = useState(false);

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const serverUrl = import.meta.env.VITE_SERVER_URL || '';
        const response = await fetch(`${serverUrl}/products`);
        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (err) {
        console.warn('Live products fetch notice:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateQuantity = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change),
    }));
  };

  const setQuantityForId = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  const getTotalItems = () =>
    Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const calculateGrandTotal = () => {
    return products
      .reduce((total, item) => {
        const quantity = quantities[item._id] || 0;
        const price = item.discountedPrice || item.actualPrice;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  const handleCartButtonClick = () => {
    if (getTotalItems() > 0) {
      setShowModal(true);
    } else {
      setShowEmptyCartModal(true);
    }
  };

  const InteractiveLogo = () => (
    <a
      href="/_admin"
      onDoubleClick={(e) => {
        e.preventDefault();
        window.location.href = "/_admin";
      }}
      className="cursor-pointer transition-all duration-200 select-none hover:scale-105 inline-block"
      title="Selvaganapathy Traders"
    >
      <img
        src="/logo.png"
        alt="Selvaganapathy Traders Logo"
        className="h-12 w-12 sm:h-14 sm:w-14 object-contain filter drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]"
        draggable={false}
      />
    </a>
  );

  return (
    <div
      className="min-h-screen relative overflow-x-hidden flex flex-col bg-slate-950 text-white selection:bg-pink-500 selection:text-white"
      style={{
        background: "radial-gradient(ellipse at top, #240b36 0%, #0c0824 50%, #030014 100%)",
      }}
    >
      {/* 1. DYNAMIC FULLSCREEN REALISTIC CRACKERS BLASTING CANVAS BACKGROUND */}
      <FireworksBackground />

      {/* 2. FLOATING CART SUMMARY BUTTON */}
      <div
        onClick={handleCartButtonClick}
        className="fixed bottom-6 right-6 z-[9998] bg-gradient-to-r from-pink-500 via-rose-600 to-purple-700 text-white rounded-2xl shadow-[0_0_35px_rgba(236,72,153,0.5)] px-5 py-3.5 flex items-center space-x-3.5 cursor-pointer select-none hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30 backdrop-blur-lg"
        title="View your crackers cart"
      >
        <div className="relative">
          <ShoppingCart size={28} className="text-white drop-shadow" />
          {getTotalItems() > 0 && (
            <div className="absolute -top-2.5 -right-2.5 bg-yellow-400 text-black text-xs font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-900 shadow-lg animate-bounce">
              {getTotalItems() > 99 ? "99+" : getTotalItems()}
            </div>
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-pink-200 leading-tight">
            {getTotalItems()} Items Selected
          </span>
          <div className="font-black text-xl text-yellow-300 drop-shadow">
            ₹ {calculateGrandTotal()}
          </div>
        </div>
      </div>

      {/* 3. FESTIVE HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[9999] w-full shadow-2xl backdrop-blur-xl bg-slate-950/80 border-b border-white/15">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5">
          <div className="flex items-center gap-3">
            <InteractiveLogo />
            <div>
              <h1 className="text-base sm:text-2xl md:text-3xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 tracking-tight">
                SELVAGANAPATHY TRADERS
              </h1>
              <p className="text-yellow-400 text-[11px] sm:text-xs font-bold tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className="text-yellow-300" />
                <span>Premium Sivakasi Fireworks &amp; Crackers</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/Pricelist.pdf";
                link.download = "Pricelist.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Price List</span>
            </button>

            <button
              onClick={() => {
                const footer = document.getElementById("footer");
                if (footer) footer.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Phone size={15} />
              <span className="hidden sm:inline">Contact</span>
            </button>
          </div>
        </div>
      </header>

      {/* 4. MAIN CONTENT HERO & CATEGORIES */}
      <main className="relative z-10 flex-1 w-full pt-20 sm:pt-24 md:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          {/* Festive Diwali Banner */}
          <section className="text-center my-6 sm:my-10 relative">
            <div className="inline-flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-3 backdrop-blur-md animate-pulse">
              <Flame size={16} className="text-yellow-400" />
              <span>Diwali Fireworks Mega Festival {year}</span>
              <Sparkles size={16} className="text-yellow-400" />
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 drop-shadow-[0_0_35px_rgba(250,204,21,0.3)]">
              HAPPY DIWALI CELEBRATION!
            </h2>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-3 font-medium opacity-90">
              Direct factory rates on 167+ authentic Sivakasi firecrackers. Select your crackers category by category below and build your Diwali bill!
            </p>
          </section>

          {/* Categorized Products Containers */}
          <section className="w-full">
            <CrackersCartTable
              products={products}
              quantities={quantities}
              updateQuantity={updateQuantity}
              setQuantityForId={setQuantityForId}
              isLoading={isLoading}
              error={error}
              showModal={showModal}
              setShowModal={setShowModal}
            />
          </section>
        </div>
      </main>

      {/* 5. EMPTY CART MODAL */}
      {showEmptyCartModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-950 rounded-3xl shadow-2xl w-full max-w-md border border-pink-500/30 p-6 text-center relative overflow-hidden">
            <button
              onClick={() => setShowEmptyCartModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full bg-white/10"
            >
              <X size={18} />
            </button>
            <div className="w-16 h-16 bg-pink-500/20 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/30 shadow-lg">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Your Cart is Empty</h3>
            <p className="text-gray-300 text-sm mb-6">
              Browse through the categories and add your favorite crackers to calculate your grand total!
            </p>
            <button
              onClick={() => setShowEmptyCartModal(false)}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-600 to-purple-600 text-white font-extrabold rounded-2xl shadow-xl hover:scale-105 transition-all text-sm"
            >
              Explore Crackers Catalog
            </button>
          </div>
        </div>
      )}

      {/* 6. FOOTER */}
      <Footer />
    </div>
  );
}
