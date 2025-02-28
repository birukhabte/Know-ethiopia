import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import ConstitutionSidebar from "../../components/ConstitutionSidebar";

const ConstitutionOverview = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const parts = [
    { number: "Chapter I", title: "General Provisions", articles: "Articles 1-7" },
    { number: "Chapter II", title: "Fundamental Principles", articles: "Articles 8-12" },
    { number: "Chapter III", title: "Fundamental Rights and Freedoms", articles: "Articles 13-44" },
    { number: "Chapter IV", title: "State Structure", articles: "Articles 45-49" },
    { number: "Chapter V", title: "Structure & Division of Powers", articles: "Articles 50-52" },
    { number: "Chapter VI", title: "The Federal Houses", articles: "Articles 53-68" },
    { number: "Chapter VII", title: "The President", articles: "Articles 69-71" },
    { number: "Chapter VIII", title: "The Executive", articles: "Articles 72-77" },
    { number: "Chapter IX", title: "Courts & Constitutional Inquiry", articles: "Articles 78-84" },
    { number: "Chapter X", title: "National Policy Principles", articles: "Articles 85-92" },
    { number: "Chapter XI", title: "Miscellaneous Provisions", articles: "Articles 93-106" },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className="relative h-[200px] md:h-[240px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2070&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/70 via-amber-800/60 to-amber-900/80" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pt-16">
            <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-amber-100 mb-2"
          >
            Constitution of Ethiopia
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-amber-50/90"
          >
            Complete overview and structure
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ConstitutionSidebar />

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            {/* Introduction */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Overview
              </h2>
              <p className={`text-lg leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                The Constitution of Ethiopia is the supreme law of the Federal Democratic Republic. It establishes a multinational federation, enumerates extensive human and democratic rights, structures the federal and regional institutions, and elevates equitable development and unity in diversity as constitutional commitments.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>106</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Articles</div>
                </div>
                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>11</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Chapters</div>
                </div>
                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-amber-50'}`}>
                  <div className={`text-3xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>2</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Federal Houses</div>
                </div>
                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <div className={`text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>547</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Constituent Delegates</div>
                </div>
              </div>
            </div>

            {/* Parts of Constitution */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Parts of the Constitution
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parts.map((part, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{part.number}</span>
                        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{part.title}</h3>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                        {part.articles}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Key Institutions */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Key Institutions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`text-center p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gradient-to-br from-amber-50 to-orange-50'}`}>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                    CC
                  </div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Constitutional Commission</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1992-1994 consultations</p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Gathered public input across all regions before drafting.</p>
                </div>
                <div className={`text-center p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                    CA
                  </div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Constituent Assembly</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>547 elected members</p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Ratified the Constitution on 8 December 1994.</p>
                </div>
                <div className={`text-center p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gradient-to-br from-green-50 to-teal-50'}`}>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                    HF
                  </div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>House of Federation</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Guardian institution</p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Interprets the Constitution and protects self-determination rights.</p>
                </div>
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default ConstitutionOverview;

