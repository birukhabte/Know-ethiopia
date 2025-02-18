import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import ConstitutionSidebar from "../../components/ConstitutionSidebar";

const AmendmentsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedAmendment, setExpandedAmendment] = useState(null);

  const majorAmendments = [
    {
      number: "Article 104",
      title: "How Amendments Begin",
      description: "Proposals can originate from a two-thirds majority in the House of Peoples' Representatives, the House of Federation, or one-third of state councils with majority support.",
      category: "Procedure"
    },
    {
      number: "Article 105(1)",
      title: "Protecting Fundamental Rights",
      description: "Human and democratic rights (Chapter III) plus Articles 104-105 require approval from every state council and two-thirds majorities in both federal houses.",
      category: "Safeguard"
    },
    {
      number: "Article 105(2)",
      title: "Other Provisions",
      description: "All remaining articles may be amended when a joint session of the federal houses approves by two-thirds and two-thirds of state councils ratify.",
      category: "Safeguard"
    },
    {
      number: "House of Federation",
      title: "Role in Amendment Oversight",
      description: "As guardian of the Constitution, the House ensures proposals respect self-determination rights before ratification.",
      category: "Institution"
    },
    {
      number: "Council of Constitutional Inquiry",
      title: "Advisory Investigations",
      description: "Reviews disputes arising during amendment debates and advises the House of Federation on constitutional consistency.",
      category: "Institution"
    },
    {
      number: "Public Deliberation",
      title: "People-Centered Process",
      description: "Article 104 mandates public discussion, especially by communities directly affected by the proposed change.",
      category: "Participation"
    },
    {
      number: "No Formal Amendments",
      title: "Continuity Since 1995",
      description: "The FDRE Constitution has not yet been formally amended; interpretations and proclamations operate within the existing text.",
      category: "Status"
    },
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
            Constitutional Amendments
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-amber-50/90"
          >
            How Ethiopia's Constitution can evolve
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
                About Constitutional Amendments
              </h2>
              <p className={`text-lg leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Article 104-105 outline how Ethiopia can amend its Constitution. To date, the FDRE charter has not been formally amended; instead, institutions such as the House of Federation and the Council of Constitutional Inquiry interpret the text to address new questions. Any future amendment must preserve the sovereignty of Nations, Nationalities, and Peoples while following rigorous approval thresholds.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>0</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Formal Amendments</div>
                </div>
                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>1995</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Charter in Force</div>
                </div>
                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-amber-50'}`}>
                  <div className={`text-3xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>2</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Approval Stages</div>
                </div>
              </div>
            </div>

            {/* Amendment Process */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Amendment Process (Articles 104-105)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-5 rounded-lg border-l-4 border-green-500 ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className={`font-bold mb-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>Initiation (Art. 104)</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Requires a two-thirds vote in either federal house or in one-third of state councils, followed by public discussion among those affected.
                  </p>
                </div>
                <div className={`p-5 rounded-lg border-l-4 border-amber-500 ${isDark ? 'bg-gray-700' : 'bg-amber-50'}`}>
                  <h3 className={`font-bold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Rights & Principles (Art. 105.1)</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Human and democratic rights plus Articles 104-105 can change only with unanimous state council approval and two-thirds support in each federal house.
                  </p>
                </div>
                <div className={`p-5 rounded-lg border-l-4 border-red-500 ${isDark ? 'bg-gray-700' : 'bg-red-50'}`}>
                  <h3 className={`font-bold mb-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>Other Provisions (Art. 105.2)</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    A joint session of both houses must approve by two-thirds, and at least two-thirds of state councils must ratify by majority vote.
                  </p>
                </div>
              </div>
            </div>

            {/* Major Amendments */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Key Safeguards & Steps
              </h2>
              <div className="space-y-3">
                {majorAmendments.map((amendment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} overflow-hidden`}
                  >
                    <button
                      onClick={() => setExpandedAmendment(expandedAmendment === index ? null : index)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          {amendment.number}
                        </span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {amendment.title}
                        </span>
                      </div>
                    </button>
                    {expandedAmendment === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`px-4 pb-4 ${isDark ? 'border-t border-gray-600' : 'border-t border-gray-200'}`}
                      >
                        <div className="pt-4">
                          <span className={`text-xs px-2 py-1 rounded mr-2 ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                            {amendment.category}
                          </span>
                          <p className={`mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {amendment.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default AmendmentsPage;
// chore: know-ethiopia backfill 1774943306
