import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import ConstitutionSidebar from "../../components/ConstitutionSidebar";

const KeyFeaturesPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    {
      title: "Multinational Federalism",
      icon: "🧭",
      description: "Regional states are delimited on the basis of settlement patterns, language, and identity (Arts. 46-47), ensuring Nations, Nationalities, and Peoples exercise self-rule.",
      color: "blue"
    },
    {
      title: "House of Federation",
      icon: "🏛️",
      description: "The upper chamber interprets the Constitution, resolves boundary disputes, and safeguards self-determination rights (Art. 62).",
      color: "green"
    },
    {
      title: "Right to Self-Determination",
      icon: "🗳️",
      description: "Article 39 provides Nations, Nationalities, and Peoples with unconditional self-determination, including the right to secede through a codified process.",
      color: "purple"
    },
    {
      title: "Human & Democratic Rights",
      icon: "🛡️",
      description: "Chapter Three consolidates civil, political, economic, social, and cultural rights with direct enforceability (Arts. 13-44).",
      color: "amber"
    },
    {
      title: "Right to Development",
      icon: "🌱",
      description: "Article 43 guarantees equitable and sustainable development for every community and mandates consultation on projects affecting them.",
      color: "red"
    },
    {
      title: "Environmental Protection",
      icon: "🌍",
      description: "Article 44 secures a clean and healthy environment and compensation for people displaced by public programs.",
      color: "indigo"
    },
    {
      title: "Equality of Languages",
      icon: "🗣️",
      description: "All Ethiopian languages enjoy equal recognition while Amharic serves as the federal working language (Art. 5).",
      color: "teal"
    },
    {
      title: "Public Ownership of Land",
      icon: "🏞️",
      description: "Land and natural resources are common property of the Nations, Nationalities, and Peoples, with secure use-rights for farmers and pastoralists (Art. 40).",
      color: "orange"
    },
    {
      title: "Council of Constitutional Inquiry",
      icon: "🧠",
      description: "Articles 82-84 establish a legal expert body that investigates constitutional disputes before recommendations reach the House of Federation.",
      color: "cyan"
    },
    {
      title: "Fiscal Equity",
      icon: "💰",
      description: "Articles 95-100 outline how the federal government and states share revenue, preventing imbalances in development.",
      color: "pink"
    },
    {
      title: "Policy Principles",
      icon: "🤝",
      description: "Chapter Ten directs the state to promote equality, social justice, and people-centered development in all policies (Arts. 85-92).",
      color: "lime"
    },
    {
      title: "Civilian Control of Defence",
      icon: "🪖",
      description: "Article 87 mandates an inclusive, non-partisan defence force under civilian leadership, reflective of Ethiopia's Nations and Nationalities.",
      color: "rose"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: isDark ? 'bg-blue-900/30' : 'bg-blue-50', border: 'border-blue-500', text: isDark ? 'text-blue-400' : 'text-blue-700' },
      green: { bg: isDark ? 'bg-green-900/30' : 'bg-green-50', border: 'border-green-500', text: isDark ? 'text-green-400' : 'text-green-700' },
      purple: { bg: isDark ? 'bg-purple-900/30' : 'bg-purple-50', border: 'border-purple-500', text: isDark ? 'text-purple-400' : 'text-purple-700' },
      amber: { bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50', border: 'border-amber-500', text: isDark ? 'text-amber-400' : 'text-amber-700' },
      red: { bg: isDark ? 'bg-red-900/30' : 'bg-red-50', border: 'border-red-500', text: isDark ? 'text-red-400' : 'text-red-700' },
      indigo: { bg: isDark ? 'bg-indigo-900/30' : 'bg-indigo-50', border: 'border-indigo-500', text: isDark ? 'text-indigo-400' : 'text-indigo-700' },
      teal: { bg: isDark ? 'bg-teal-900/30' : 'bg-teal-50', border: 'border-teal-500', text: isDark ? 'text-teal-400' : 'text-teal-700' },
      orange: { bg: isDark ? 'bg-orange-900/30' : 'bg-orange-50', border: 'border-orange-500', text: isDark ? 'text-orange-400' : 'text-orange-700' },
      cyan: { bg: isDark ? 'bg-cyan-900/30' : 'bg-cyan-50', border: 'border-cyan-500', text: isDark ? 'text-cyan-400' : 'text-cyan-700' },
      pink: { bg: isDark ? 'bg-pink-900/30' : 'bg-pink-50', border: 'border-pink-500', text: isDark ? 'text-pink-400' : 'text-pink-700' },
      lime: { bg: isDark ? 'bg-lime-900/30' : 'bg-lime-50', border: 'border-lime-500', text: isDark ? 'text-lime-400' : 'text-lime-700' },
      rose: { bg: isDark ? 'bg-rose-900/30' : 'bg-rose-50', border: 'border-rose-500', text: isDark ? 'text-rose-400' : 'text-rose-700' },
    };
    return colors[color] || colors.blue;
  };

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
            Key Features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-amber-50/90"
          >
            Salient features of the Ethiopian Constitution
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
                Salient Features of the Constitution
              </h2>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Ethiopia's Constitution articulates a multinational federal order rooted in equality, self-rule, and shared prosperity. These features highlight how the charter balances unity with diversity while advancing human and democratic rights.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const colorClasses = getColorClasses(feature.color);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden border-l-4 ${colorClasses.border}`}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="text-3xl mr-3">{feature.icon}</span>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {feature.title}
                        </h3>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className={`mt-8 ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-amber-500 to-orange-500'} rounded-xl shadow-lg p-8 text-white`}
            >
              <h3 className="text-xl font-bold mb-4">Why These Features Matter</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Unity in Diversity</h4>
                  <p className="text-sm opacity-90">Multinational federalism allows cultures, languages, and regions to flourish while sustaining a common constitutional identity.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Democratic Values</h4>
                  <p className="text-sm opacity-90">Robust rights and representative institutions keep sovereignty with the people at every level of government.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Social Justice</h4>
                  <p className="text-sm opacity-90">Policy principles and economic rights aim to correct historical inequities and ensure equitable development.</p>
                </div>
              </div>
            </motion.div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default KeyFeaturesPage;

