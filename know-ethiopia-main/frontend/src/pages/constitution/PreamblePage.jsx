import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import ConstitutionSidebar from "../../components/ConstitutionSidebar";

const PreamblePage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
            The Preamble
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-amber-50/90"
          >
            The soul of the Ethiopian Constitution
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
            {/* Preamble Text Card */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
              <div className="border-l-4 border-amber-500 pl-6">
                <p className={`text-lg md:text-xl leading-relaxed italic ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  "WE, THE NATIONS, NATIONALITIES AND PEOPLES OF ETHIOPIA: Strongly committed, in full and free exercise of our right to self-determination, to building a political community founded on the rule of law and capable of ensuring a lasting peace, guaranteeing a democratic order, and advancing our economic and social development..."
                </p>
                <ul className={`mt-4 space-y-2 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Affirm our resolve to live together on the basis of <span className="font-semibold">equality and mutual consent</span>.</li>
                  <li>Pledge to respect <span className="font-semibold">human and democratic rights</span> for every person.</li>
                  <li>Commit to <span className="font-semibold">sustainable development</span> that benefits all communities.</li>
                  <li>Seek to preserve our rich cultures while forging <span className="font-semibold">one economic community</span>.</li>
                </ul>
                <p className={`mt-4 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Adopted on 8 December 1994, the Preamble expresses a shared destiny for all Ethiopian peoples and anchors the Federal Democratic Republic of Ethiopia.
                </p>
              </div>
            </div>

            {/* Understanding the Preamble */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Understanding the Preamble
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-5 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Sovereignty of the People</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Article 8 confirms that sovereign power resides in Ethiopia's Nations, Nationalities, and Peoples, expressed through elected representatives and direct participation.
                  </p>
                </div>
                
                <div className={`p-5 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>Unity in Diversity</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    The Preamble celebrates shared interests built over centuries of interaction, ensuring each community can preserve its identity while embracing a common destiny.
                  </p>
                </div>
                
                <div className={`p-5 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>Secular & Inclusive State</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Article 11 separates state and religion, reflecting the Preamble's promise to live without religious discrimination.
                  </p>
                </div>
                
                <div className={`p-5 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-amber-50'}`}>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Rule of Law</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    The preamble's call for a polity founded on law is enforced through constitutional supremacy (Art. 9) and accountable government (Art. 12).
                  </p>
                </div>
                
                <div className={`p-5 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-red-50'}`}>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>Self-Determination</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    The Preamble foreshadows Article 39 by affirming the right of Nations, Nationalities, and Peoples to manage their affairs, including equitable representation in federal and state institutions.
                  </p>
                </div>
                
                <div className={`p-5 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>Shared Prosperity</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Sustainable economic and social development is a core aspiration, later detailed in Articles 43 and 89 on the right to development and equitable growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Historical Significance */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Historical Significance
              </h2>
              
              <div className="space-y-4">
                <div className={`flex items-start ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">1</div>
                  <p>The Preamble was adopted on 8 December 1994 by the Constituent Assembly after two years of nationwide consultations.</p>
                </div>
                <div className={`flex items-start ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">2</div>
                  <p>It entered into force on 21 August 1995, ushering in the Federal Democratic Republic of Ethiopia.</p>
                </div>
                <div className={`flex items-start ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">3</div>
                  <p>The text internalizes lessons from the 1931 and 1955 imperial constitutions as well as the 1991 Transitional Charter, prioritizing equality among Nations, Nationalities, and Peoples.</p>
                </div>
                <div className={`flex items-start ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">4</div>
                  <p>Article 106 makes the Amharic version of the Constitution, including the Preamble, the final legal authority for interpretation.</p>
                </div>
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default PreamblePage;

