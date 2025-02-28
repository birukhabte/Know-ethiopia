import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import ConstitutionSidebar from "../../components/ConstitutionSidebar";

const ConstitutionalInitiation = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const timeline = [
    { year: "1931", event: "First written constitution promulgated under Emperor Haile Selassie" },
    { year: "1955", event: "Revised Imperial Constitution expands parliament and codifies rights" },
    { year: "1974", event: "Revolution ends the monarchy; transitional proclamations replace imperial charter" },
    { year: "1987", event: "People's Democratic Republic of Ethiopia adopts a socialist constitution" },
    { year: "1991", event: "Transitional Charter recognizes Nations, Nationalities, and Peoples" },
    { year: "1992", event: "Constitutional Commission established to collect public input" },
    { year: "1994", event: "547-member Constituent Assembly debates and ratifies the draft" },
    { year: "1995", event: "FDRE Constitution enters into force on 21 August, inaugurating the republic" },
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
            Constitutional Initiation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-amber-50/90"
          >
            The journey to Ethiopia's Constitution
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
                The Making of Ethiopia's Constitution
              </h2>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Ethiopia's current constitution emerged from a decade of political transformation. A nationwide Constitutional Commission (1992-1994) gathered feedback from every region before a 547-member Constituent Assembly debated, refined, and adopted the final text on 8 December 1994. The charter took effect on 21 August 1995, formally establishing the Federal Democratic Republic of Ethiopia.
              </p>
            </div>

            {/* Timeline */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Timeline of Events
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                
                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="relative pl-12"
                    >
                      {/* Dot */}
                      <div className={`absolute left-2 w-5 h-5 rounded-full border-4 ${
                        index === timeline.length - 1 
                          ? 'bg-amber-500 border-amber-200' 
                          : isDark ? 'bg-gray-600 border-gray-800' : 'bg-white border-blue-500'
                      }`}></div>
                      
                      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <span className={`text-sm font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          {item.year}
                        </span>
                        <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.event}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Constituent Assembly Facts */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Constituent Assembly Facts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-5 rounded-lg border-l-4 border-blue-500 ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Delegates</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    547 representatives from every Nation, Nationality, and People took part in the Constituent Assembly.
                  </p>
                </div>
                <div className={`p-5 rounded-lg border-l-4 border-green-500 ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Public Consultations</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    The Constitutional Commission held hearings in all regions and collected written submissions from communities and civic groups.
                  </p>
                </div>
                <div className={`p-5 rounded-lg border-l-4 border-amber-500 ${isDark ? 'bg-gray-700' : 'bg-amber-50'}`}>
                  <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Adoption & Effect</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Adopted 8 December 1994 and effective 21 August 1995, aligning with the new federal calendar year.
                  </p>
                </div>
                <div className={`p-5 rounded-lg border-l-4 border-purple-500 ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Authoritative Text</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Article 106 establishes the Amharic version as legally controlling, while translations expand access.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Bodies */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Key Bodies in the Drafting Process
              </h2>
              <div className="space-y-4">
                {[
                  { name: "Constitutional Commission", role: "Coordinated research and compiled public submissions before producing the draft." },
                  { name: "Council of Representatives", role: "Oversaw the transition, set timelines, and forwarded the draft to the Assembly." },
                  { name: "Constituent Assembly Working Groups", role: "Subject-matter teams refined chapters on rights, federalism, and finance." },
                  { name: "Regional Consultation Teams", role: "Regional councils and elders facilitated dialogues in local languages." },
                  { name: "Council of Constitutional Inquiry (conceptual phase)", role: "Designed the post-1995 mechanism for constitutional interpretation." },
                ].map((body, index) => (
                  <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{body.name}</h3>
                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{body.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default ConstitutionalInitiation;

