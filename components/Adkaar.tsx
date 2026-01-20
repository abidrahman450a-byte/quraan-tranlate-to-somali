
import React, { useState } from 'react';
import { AdkaarItem } from '../types';

const adkaarData: AdkaarItem[] = [
  // Subaxda
  {
    category: "Subaxda",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    somali: "Waxaan baryinnay annagoo u sugnaaday xukunka Eebe, mahadna Eebe u sugnaatay, Eebe mooyee ilaah kale ma jiro isaga kaliya, wax la wadaagana ma jiro, xukunka isagaa leh mahadna isagaa leh, wax kasta na waa u karaa.",
    count: 1,
    reference: "Muslim"
  },
  {
    category: "Subaxda",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    somali: "Alloow adiga darteed ayaan ku baryinnay, adiga darteed ayaan ku galabbaysannay, adiga darteed ayaan u noolnahay, adiga darteed ayaan u dhimanaynaa, xagaagana waa loo soo noolaanayaa.",
    count: 1,
    reference: "Tirmidi"
  },
  {
    category: "Subaxda & Galabta",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    somali: "Waxaan ka magan galayaa ereyada Eebe ee dhammaystiran sharka waxa uu abuuray.",
    count: 3,
    reference: "Muslim"
  },
  {
    category: "Subaxda & Galabta",
    arabic: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    somali: "Magaca Eebe ee aan waxba dhibayn magaciisa dhulka iyo cirka midna, isagaana ah Maqle Og.",
    count: 3,
    reference: "Abu Daawuud"
  },
  {
    category: "Subaxda & Galabta",
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
    somali: "Eebe ayaa hufan oo mahad leh: inta u dhiganta tirada uunkiisa, inta raalligelisa naftiisa, inta u dhiganta miisaanka carshigiisa, iyo inta u dhiganta khadkiisa ereyadiisa.",
    count: 3,
    reference: "Muslim"
  },
  // Galabta
  {
    category: "Galabta",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
    somali: "Waxaan galabbaysannay annagoo u sugnaaday xukunka Eebe, mahadna Eebe u sugnaatay, Eebe mooyee ilaah kale ma jiro isaga kaliya.",
    count: 1,
    reference: "Muslim"
  },
  {
    category: "Galabta",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    somali: "Alloow adiga darteed ayaan ku galabbaysannay, adiga darteed ayaan ku baryinnay, adiga darteed ayaan u noolnahay, adiga darteed ayaan u dhimanaynaa, xagaagana waa loo noqonayaa.",
    count: 1,
    reference: "Tirmidi"
  },
  // Salaadda Ka Dib
  {
    category: "Salaadda Ka Dib",
    arabic: "أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ. اللَّهُمَّ أَنْتَ السَّلامُ وَمِنْكَ السَّلامُ، تَبَارَكْتَ يَا ذَا الْجَلالِ وَالإِكْرَامِ",
    somali: "Eebbow dambi dhaaf baan ku weydiisanayaa (3 jeer). Alloow adigu nabad baad tahay, nabadna xagaaga ayey ka timaadaa, waad barakoowday ka weynaan iyo sharaf lahow.",
    count: 1,
    reference: "Muslim"
  },
  {
    category: "Salaadda Ka Dib",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ",
    somali: "Alloow igu caawi xuskaaga, mahadnaqaaga iyo wanaajinta cibaadadaada.",
    count: 1,
    reference: "Abu Daawuud"
  },
  // Hurdo Ka Hor
  {
    category: "Hurdo Ka Hor",
    arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
    somali: "Magacaaga Rabbiyaan dhinacayga dhigay, adigaana kor ugu qaadaya, haddaad naftayda qabato u naxariiso, haddaad siidaysana ku ilaali waxaad ku ilaaliso addoomadaada suuban.",
    count: 1,
    reference: "Bukhaari & Muslim"
  },
  {
    category: "Hurdo Ka Hor",
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    somali: "Alloow iga badbaadi cadaabkaaga maalinta aad soo bixinayso addoomadaada.",
    count: 3,
    reference: "Abu Daawuud"
  }
];

const Adkaar: React.FC = () => {
  const [filter, setFilter] = useState('Dhammaan');
  const categories = ['Dhammaan', 'Subaxda', 'Galabta', 'Salaadda Ka Dib', 'Hurdo Ka Hor'];

  const filteredAdkaar = filter === 'Dhammaan' 
    ? adkaarData 
    : adkaarData.filter(a => a.category === filter);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Adkaar iyo Ducooyin</h2>
        <p className="text-slate-500">Ducooyinka maalinlaha ah ee laga soo xigtay sunnada Nabiga (NNKH)</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === cat ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredAdkaar.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {item.category}
              </span>
              <span className="text-xs text-slate-400">Tirada: {item.count} jeer</span>
            </div>
            <p className="quran-font text-2xl text-right text-slate-800 mb-6 leading-relaxed" dir="rtl">
              {item.arabic}
            </p>
            <div className="border-t border-slate-50 pt-4">
              <p className="text-slate-600 italic leading-relaxed">
                {item.somali}
              </p>
              <p className="text-[10px] text-slate-400 mt-2 uppercase">Isha: {item.reference}</p>
            </div>
          </div>
        ))}
        {filteredAdkaar.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            Ma jiraan adkaar loo helay qaybtan.
          </div>
        )}
      </div>
    </div>
  );
};

export default Adkaar;
