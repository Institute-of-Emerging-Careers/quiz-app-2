const cities = [
  "Abbottabad",
  "Abdul Hakim",
  "Ahmadpur East",
  "Aliabad",
  "Alpurai",
  "Athmuqam",
  "Attock City",
  "Attock Khurd",
  "Awaran",
  "Badin",
  "Bagh",
  "Bahawalnagar",
  "Bahawalpur",
  "Bannu",
  "Barkhan",
  "Batgram",
  "Bhakkar",
  "Bhalwal",
  "Chakwal",
  "Chaman",
  "Charsadda",
  "Chenab Nagar",
  "Chilas",
  "Chiniot",
  "Chishtian",
  "Chitral",
  "Chunian",
  "Dadu",
  "Daggar",
  "Dainyor",
  "Dalbandin",
  "Dasu",
  "Dera Allahyar",
  "Dera Bugti",
  "Dera Ghazi Khan",
  "Dera Ismail Khan",
  "Dera Murad Jamali",
  "Dipalpur",
  "Eidgah",
  "Faisalabad",
  "Gakuch",
  "Gandava",
  "Ghotki",
  "Gilgit",
  "Gojra",
  "Gujranwala",
  "Gujrat",
  "Gwadar",
  "Hafizabad",
  "Hangu",
  "Haripur",
  "Harunabad",
  "Hasilpur",
  "Hassan Abdal",
  "Hujra Shah Muqim",
  "Hyderabad City",
  "Islamabad",
  "Jacobabad",
  "Jalalpur Jattan",
  "Jamshoro",
  "Jaranwala",
  "Jhang City",
  "Jhelum",
  "Kabirwala",
  "Kahror Pakka",
  "Kalat",
  "Kamalia",
  "Kandhkot",
  "Karachi",
  "Karak",
  "Kasur",
  "Khairpur Mirâ€™s",
  "Khanewal",
  "Khanpur",
  "Kharan",
  "Kharian",
  "Khushab",
  "Khuzdar",
  "Khuzdar",
  "Kohat",
  "Kohlu",
  "Kot Addu",
  "Kotli",
  "Kulachi",
  "Kundian",
  "Lahore",
  "Lakki",
  "Lala Musa",
  "Larkana",
  "Leiah",
  "Lodhran",
  "Loralai",
  "Malakand",
  "Mandi Bahauddin",
  "Mandi Burewala",
  "Mansehra",
  "Mardan",
  "Mastung",
  "Matiari",
  "Mian Channun",
  "Mianwali",
  "Mingaora",
  "Mirpur Khas",
  "Multan",
  "Muridke",
  "Musa Khel Bazar",
  "Muzaffarabad",
  "Muzaffargarh",
  "Nankana Sahib",
  "Narowal",
  "Naushahro Firoz",
  "Nawabshah",
  "New Mirpur",
  "Nowshera",
  "Okara",
  "Pakpattan",
  "Panjgur",
  "Parachinar",
  "Pasrur",
  "Pattoki",
  "Peshawar",
  "Pishin",
  "Qila Saifullah",
  "Quetta",
  "Rahimyar Khan",
  "Rajanpur",
  "Rawala Kot",
  "Rawalpindi",
  "Risalpur Cantonment",
  "Saddiqabad",
  "Sahiwal",
  "Saidu Sharif",
  "Sambrial",
  "Samundri",
  "Sanghar",
  "Sargodha",
  "Shahdad Kot",
  "Shakargarh",
  "Shekhupura",
  "Shikarpur",
  "Shujaabad",
  "Sialkot City",
  "Sibi",
  "Sukkur",
  "Swabi",
  "Tando Allahyar",
  "Tando Muhammad Khan",
  "Tank",
  "Thatta",
  "Timargara",
  "Toba Tek Singh",
  "Turbat",
  "Umarkot",
  "Upper Dir",
  "Uthal",
  "Vihari",
  "Zhob",
  "Ziarat",
  "Other",
];

const provinces = [
  "Gilgit Baltistan",
  "Balochistan",
  "Sindh",
  "Punjab",
  "KPK",
  "AJK",
  "Islamabad",
];

const universities = [
  "Other",
  "Abasyn University",
  "Abbottabad University of Science and Technology",
  "Abdul Wali Khan University Mardan",
  "Aga Khan University",
  "Air University, Islamabad",
  "Al-Hamd Islamic University",
  "Al-Khair University",
  "Al-Qadir University",
  "Allama Iqbal Open University",
  "Baba Guru Nanak University",
  "Bacha Khan University",
  "Bahauddin Zakariya University",
  "Bahria University",
  "Balochistan University of Engineering and Technology",
  "Balochistan University of Information Technology, Engineering and Management Sciences",
  "Baltistan University",
  "Baqai Medical University",
  "Beaconhouse National University",
  "Begum Nusrat Bhutto Women University",
  "Benazir Bhutto Shaheed University",
  "Benazir Bhutto Shaheed University of Technology and Skill Development",
  "Capital University of Science & Technology",
  "CECOS University of Information Technology and Emerging Sciences",
  "Cholistan University of Veterinary and Animal Sciences",
  "City University of Science and Information Technology, Peshawar",
  "Commecs institute of business and emerging sciences",
  "COMSATS University",
  "Dadabhoy Institute of Higher Education",
  "Dawood University of Engineering and Technology",
  "DHA Suffa University",
  "Dow University of Health Sciences",
  "Faisalabad Medical University",
  "FATA University",
  "Fatima Jinnah Medical University",
  "Fatima Jinnah Women University",
  "Federal Urdu University of Arts, Science and Technology",
  "Forman Christian College",
  "Foundation University, Islamabad",
  "Gandhara University",
  "Ghazi University",
  "Ghulam Ishaq Khan Institute of Engineering Sciences and Technology",
  "GIFT University",
  "Gomal University",
  "Government College University Hyderabad",
  "Government College University, Faisalabad",
  "Government College University, Lahore",
  "Government College Women University, Faisalabad",
  "Government College Women University, Sialkot",
  "Government Sadiq College Women University",
  "Government Viqar-un-Nisa Women University",
  "Grand Asian University Sialkot",
  "Green International University",
  "Greenwich University, Karachi",
  "Habib University",
  "Hajvery University",
  "Hamdard University",
  "Hazara University",
  "HITEC University",
  "Hyderabad Institute of Arts, Science and Technology",
  "Ibadat International University",
  "Ilma University",
  "Indus University",
  "Indus Valley School of Art and Architecture",
  "Information Technology University (Lahore)",
  "Institute for Art and Culture",
  "Institute of Business Administration, Karachi",
  "Institute of Business Management",
  "Institute of Management Sciences Peshawar",
  "Institute of Management Sciences, Lahore",
  "Institute of Southern Punjab",
  "Institute of Space Technology",
  "International Islamic University, Islamabad",
  "IQRA National University",
  "Iqra University",
  "Islamia College University",
  "Isra University",
  "Jinnah Sindh Medical University",
  "Jinnah University for Women",
  "Karachi Institute of Economics and Technology",
  "Karachi School for Business and Leadership",
  "Karakoram International University",
  "KASB Institute of Technology",
  "Khawaja Fareed University of Engineering and Information Technology",
  "Khushal Khan Khattak University",
  "Khyber Medical University",
  "King Edward Medical University",
  "Kinnaird College for Women University",
  "Kohat University of Science and Technology",
  "Kohsar University Murree",
  "Lahore College for Women University",
  "Lahore Garrison University",
  "Lahore Institute of Science and Technology",
  "Lahore School of Economics",
  "Lahore University of Management Sciences",
  "Lasbela University of Agriculture, Water and Marine Sciences",
  "Liaquat University of Medical and Health Sciences",
  "Mehran University of Engineering and Technology",
  "Minhaj University, Lahore",
  "Mir Chakar Khan Rind University",
  "Mir Chakar Khan Rind University of Technology",
  "Mirpur University of Science and Technology",
  "Mohi-ud-Din Islamic University",
  "Muhammad Ali Jinnah University",
  "Muhammad Nawaz Sharif University of Agriculture",
  "Muhammad Nawaz Sharif University of Engineering and Technology",
  "Muslim Youth University",
  "Namal Institute",
  "National College of Arts",
  "National College of Business Administration and Economics",
  "National Defence University, Pakistan",
  "National Skills University",
  "National Textile University",
  "National University of Computer and Emerging Sciences",
  "National University of Medical Sciences",
  "National University of Modern Languages",
  "National University of Sciences and Technology, Pakistan",
  "National University of Technology",
  "Nazeer Hussain University",
  "NED University of Engineering and Technology",
  "Newports Institute of Communications and Economics",
  "NFC Institute of Engineering and Technology",
  "Nishtar Medical University",
  "Northern University, Nowshera",
  "NUR International University",
  "Pak-Austria Fachhochschule: Institute of Applied Sciences and Technology[30]",
  "Pakistan Air Force Academy",
  "Pakistan Institute of Development Economics",
  "Pakistan Institute of Engineering and Applied Sciences",
  "Pakistan Institute of Fashion and Design",
  "Pakistan Military Academy",
  "Pakistan Naval Academy",
  "Peoples University of Medical and Health Sciences for Women",
  "Pir Abdul Qadir Shah Jeelani Institute of Medical Sciences",
  "Pir Mehr Ali Shah Arid Agriculture University",
  "Preston Institute of Management Sciences and Technology",
  "Preston University",
  "Punjab Tianjin University of Technology",
  "Qalandar Shahbaz University of Modern Sciences",
  "Qarshi University",
  "Quaid-e-Awam University of Engineering, Science and Technology",
  "Quaid-i-Azam University",
  "Qurtuba University",
  "Rawalpindi Medical University",
  "Rawalpindi Women University",
  "Riphah International University",
  "Salim Habib University",
  "Sardar Bahadur Khan Women's University",
  "Sarhad University of Science and Information Technology",
  "Shah Abdul Latif University",
  "Shaheed Benazir Bhutto City University",
  "Shaheed Benazir Bhutto Dewan University",
  "Shaheed Benazir Bhutto University of Veterinary and Animal Sciences",
  "Shaheed Benazir Bhutto University, Nawabshah",
  "Shaheed Benazir Bhutto University, Sheringal",
  "Shaheed Benazir Bhutto Women University",
  "Shaheed Mohtarma Benazir Bhutto Medical University",
  "Shaheed Zulfiqar Ali Bhutto Institute of Science and Technology",
  "Shaheed Zulfiqar Ali Bhutto Medical University",
  "Shaheed Zulfiqar Ali Bhutto University of Law",
  "Shaikh Ayaz University",
  "Shifa Tameer-e-Millat University",
  "Sindh Agriculture University",
  "Sindh Institute of Medical Sciences",
  "Sindh Madressatul Islam University",
  "Sir Syed CASE Institute of Technology",
  "Sir Syed University of Engineering and Technology",
  "Sukkur IBA University",
  "Superior University",
  "Textile Institute of Pakistan",
  "Thal University",
  "The Islamia University of Bahawalpur",
  "University of Agriculture, Dera Ismail Khan",
  "University of Agriculture, Faisalabad",
  "University of Agriculture, Peshawar",
  "University of Azad Jammu and Kashmir",
  "University of Balochistan",
  "University of Buner[24]",
  "University of Central Punjab",
  "University of Chakwal",
  "University of Chitral",
  "University of Dir",
  "University of EAST",
  "University of Education",
  "University of Engineering and Technology, Lahore",
  "University of Engineering and Technology, Mardan",
  "University of Engineering and Technology, Peshawar",
  "University of Engineering and Technology, Rasul",
  "University of Engineering and Technology, Taxila",
  "University of Faisalabad",
  "University of Gujrat",
  "University of Gwadar",
  "University of Haripur",
  "University of Health Sciences, Lahore",
  "University of Home Economics Lahore",
  "University of Jhang",
  "University of Karachi",
  "University of Kotli",
  "University of Lahore",
  "University of Lakki Marwat",
  "University of Loralai",
  "University of Malakand",
  "University of Management and Technology, Lahore",
  "University of Mianwali",
  "University of Narowal",
  "University of Okara",
  "University of Peshawar",
  "University of Poonch",
  "University of Sahiwal",
  "University of Sargodha",
  "University of Science and Technology Bannu",
  "University of Sialkot",
  "University of Sindh",
  "University of South Asia",
  "University of Sufism and Modern Sciences",
  "University of Swabi",
  "University of Swat",
  "University of Technology, Nowshera",
  "University of the Punjab",
  "University of Turbat",
  "University of Veterinary and Animal Sciences",
  "University of Wah",
  "Virtual University of Pakistan",
  "Women University Mardan",
  "Women University Multan",
  "Women University of Azad Jammu and Kashmir Bagh",
  "Women University Swabi",
  "Ziauddin University",
];

const countries = ["Pakistan"];

const education_levels = [
  "None",
  "Matric/O Levels",
  "Inter/A Levels",
  "Bachelors (2 years)",
  "Bachelors (4 years)",
  "Diploma after Matric/O Levels",
  "Diploma after Inter/A Levels",
  "Masters",
  "MPhil",
  "PhD",
];

const degree_choice = [
  "My Choice",
  "Family/Siblings/Others",
  "Both"
];

const type_of_employment = ["Part Time", "Full Time", "Not Employed"];

const income_brackets = ["Below 25,000", "25,000 - 50,000", "50,000 - 100,000", "100,000 - 150,000", "Above 150,000"]

const age_groups = ["Under 20", "20-24", "25-29", "30-34", "35-40", "Above 40"];

const people_in_household = ["1", "2",  "3", "4", "5", "6", "7", "8", "9+"]

const knows_from_IEC = ["Yes, a current student", "Yes, a graduated student", "Yes, a staff member", "No, I don't know anyone"]

const sources_of_information = [
  "Social Media",
  "IEC Student",
  "IEC Team Member",
  "Word of Mouth",
  "Email",
  "SMS",
  "Other",
];

const reasons_to_join = [
  "Want to Establish Career",
  "Have relevant Specialization/Educational Background ",
  "Have Prior Experience",
  "Want to attain additional skill set to support own business/startup/enterprise",
  "Want to further polish and enhance the skill set",
  "Want to pursue a full time job in the field ",
  "Want to attain freelance opportunities",
  "Want to switch my career/job ",
  "Other",
]

module.exports = {
  cities,
  provinces,
  countries,
  education_levels,
  universities,
  degree_choice,
  type_of_employment,
  income_brackets,
  people_in_household,
  age_groups,
  knows_from_IEC,
  sources_of_information,
  reasons_to_join
};
