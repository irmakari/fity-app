const dotenv = require('dotenv');
dotenv.config();

const { supabase } = require('./config/db');

const initialExercises = [
  {
    name: 'Bench Press',
    category: 'Chest',
    target_muscle: 'Chest',
    secondary_muscles: ['Triceps', 'Shoulders'],
    equipment: 'Barbell',
    description: 'Büyük göğüs kaslarını (Pectoralis Major) çalıştıran temel itiş hareketi.',
    instructions: [
      'Bara omuz genişliğinden biraz daha geniş tutuşla geçin.',
      'Nefes alarak barı göğsünüzün ortasına doğru yavaşça indirin.',
      'Nefes vererek patlayıcı bir şekilde yukarı itin.'
    ],
    gif_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW9uaGpzbmhpbWNpaG5yOWlybmdsdnI0cXp0YmpqbXRlOHBnM3B0bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKR15dKxM1T5Q1i/giphy.gif',
    video_url: 'https://www.youtube.com/watch?v=rT7DgCr-3pg'
  },
  {
    name: 'Squat',
    category: 'Legs',
    target_muscle: 'Legs',
    secondary_muscles: ['Glutes', 'Core'],
    equipment: 'Barbell',
    description: 'Bacak ve kalça kaslarını hedefleyen temel alt vücut egzersizi.',
    instructions: [
      'Barı üst sırt kaslarınıza yerleştirin ve omuz genişliğinde durun.',
      'Dizlerinizi bükerek kalçanızı geriye doğru indirin.',
      'Uyluklarınız yere paralel olana kadar inip tekrar yukarı kalkın.'
    ],
    gif_url: 'https://media.giphy.com/media/xT39D7ubkZDoiZz7OM/giphy.gif',
    video_url: 'https://www.youtube.com/watch?v=ultWZbUMPL8'
  },
  {
    name: 'Deadlift',
    category: 'Back',
    target_muscle: 'Back',
    secondary_muscles: ['Hamstrings', 'Glutes', 'Grip'],
    equipment: 'Barbell',
    description: 'Tüm arka zincir kaslarını güçlendiren bileşik hareket.',
    instructions: [
      'Bar ayaklarınızın ortasında kalacak şekilde durun.',
      'Sırtınızı düz tutarak kalçanızdan öne doğru eğilin ve barı kavrayın.',
      'Gövdenizi ve bacaklarınızı kilitşeyerek ağırlığı kaldırın.'
    ],
    gif_url: 'https://media.giphy.com/media/3o7TKR7xZtXW0jS14k/giphy.gif',
    video_url: 'https://www.youtube.com/watch?v=op9kVnSso6Q'
  },
  {
    name: 'Bicep Curls',
    category: 'Arms',
    target_muscle: 'Biceps',
    secondary_muscles: ['Forearms'],
    equipment: 'Dumbbell',
    description: 'Ön kol ve bicep kaslarını izole eden klasik dambıl egzersizi.',
    instructions: [
      'Dambılları yanlarınızda avuç içleri öne bakacak şekilde tutun.',
      'Dirseklerinizi sabitleyerek dambılları omuzlarınıza doğru kaldırın.',
      'Tepe noktada sıktıktan sonra kontrollü şekilde indirin.'
    ],
    gif_url: 'https://media.giphy.com/media/l41Ys1f65qhwxZ1pC/giphy.gif',
    video_url: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo'
  },
  {
    name: 'Overhead Press',
    category: 'Shoulders',
    target_muscle: 'Shoulders',
    secondary_muscles: ['Triceps', 'Upper Chest'],
    equipment: 'Barbell',
    description: 'Omuz kaslarını geliştiren ayakta baş üstü press hareketi.',
    instructions: [
      'Barı köprücük kemiği hizasında kavrayın.',
      'Gövdenizi sıkı tutarak barı başınızın üzerine doğru itin.',
      'Tepe noktada kilitledikten sonra yavaşça başlangıç pozisyonuna indirin.'
    ],
    gif_url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
    video_url: 'https://www.youtube.com/watch?v=2yjwXTZQDDI'
  },
  {
    name: 'Lat Pulldown',
    category: 'Back',
    target_muscle: 'Back',
    secondary_muscles: ['Biceps', 'Rear Delts'],
    equipment: 'Cable',
    description: 'Kanat ve sırt kaslarını genişleten kablolu çekiş hareketi.',
    instructions: [
      'Makineye oturup barı geniş tutuşla kavrayın.',
      'Göğsünüzü yukarı kaldırarak barı üst göğsünüze doğru çekin.',
      'Sırt kaslarınızı sıkıp yavaşça serbest bırakın.'
    ],
    gif_url: 'https://media.giphy.com/media/3o7TKURJ0pT5S/giphy.gif',
    video_url: 'https://www.youtube.com/watch?v=CAwf7n6Luuc'
  }
];

const initialFoods = [
  { name: 'Haşlanmış Yumurta', calories: 155, protein_g: 13, carbs_g: 1.1, fat_g: 11, serving_size_g: 100, serving_size: '100g (yaklaşık 2 adet)' },
  { name: 'Izgara Tavuk Göğsü', calories: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6, serving_size_g: 100, serving_size: '100g' },
  { name: 'Beyaz Peynir (Tam Yağlı)', calories: 260, protein_g: 15, carbs_g: 2.5, fat_g: 21, serving_size_g: 100, serving_size: '100g' },
  { name: 'Pirinç Pilavı', calories: 130, protein_g: 2.7, carbs_g: 28, fat_g: 0.3, serving_size_g: 100, serving_size: '100g' },
  { name: 'Yulaf Ezmesi', calories: 389, protein_g: 16.9, carbs_g: 66, fat_g: 6.9, serving_size_g: 100, serving_size: '100g' },
  { name: 'Fıstık Ezmesi (Doğal)', calories: 588, protein_g: 25, carbs_g: 20, fat_g: 50, serving_size_g: 100, serving_size: '100g' },
  { name: 'Somon Balığı (Izgara)', calories: 206, protein_g: 22, carbs_g: 0, fat_g: 13, serving_size_g: 100, serving_size: '100g' },
  { name: 'Muz', calories: 89, protein_g: 1.1, carbs_g: 23, fat_g: 0.3, serving_size_g: 100, serving_size: '1 orta boy (100g)' },
  { name: 'Elma', calories: 52, protein_g: 0.3, carbs_g: 14, fat_g: 0.2, serving_size_g: 100, serving_size: '1 adet (100g)' },
  { name: 'Çiğ Badem', calories: 579, protein_g: 21, carbs_g: 22, fat_g: 49, serving_size_g: 100, serving_size: '100g' },
  { name: 'Süzme Yoğurt', calories: 97, protein_g: 9, carbs_g: 3.9, fat_g: 5, serving_size_g: 100, serving_size: '100g' },
  { name: 'Izgara Köfte', calories: 250, protein_g: 18, carbs_g: 4, fat_g: 18, serving_size_g: 100, serving_size: '100g (yaklaşık 4 adet)' }
];

async function seed() {
  console.log('🌱 Starting Supabase seed process...');

  // Seed Exercises
  for (const ex of initialExercises) {
    const { data: existing } = await supabase
      .from('exercises')
      .select('id')
      .ilike('name', ex.name)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('exercises')
        .update(ex)
        .eq('id', existing.id);
      console.log(` Updated exercise: ${ex.name}`);
    } else {
      await supabase
        .from('exercises')
        .insert([ex]);
      console.log(` Inserted exercise: ${ex.name}`);
    }
  }

  // Seed Foods
  for (const food of initialFoods) {
    const { data: existing } = await supabase
      .from('foods')
      .select('id')
      .ilike('name', food.name)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('foods')
        .update(food)
        .eq('id', existing.id);
      console.log(` Updated food: ${food.name}`);
    } else {
      await supabase
        .from('foods')
        .insert([{ ...food, source: 'custom' }]);
      console.log(` Inserted food: ${food.name}`);
    }
  }

  console.log('✅ Supabase seed process completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
