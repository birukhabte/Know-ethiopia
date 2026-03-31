import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Linkedin, Github, ChevronDown, Sparkles, Send, Clock, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { updateSEO, SEO_CONFIG } from '../utils/seo';

const ContactUs = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    // SEO: Set page meta tags on mount
    useEffect(() => {
        updateSEO(SEO_CONFIG.contact);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || !navigator.geolocation) {
            setLocationError("Geolocation not supported. Showing Addis Ababa.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationError(null);
            },
            () => {
                setLocationError("Unable to access your location. Showing Addis Ababa.");
            }
        );
    }, []);

    const contactCards = [
        {
            icon: MapPin,
            title: "Addis Ababa",
            subtitle: "",
            details: "Addis Ababa, Ethiopia",
            gradient: "from-emerald-500 to-teal-600",
            lightBg: "from-emerald-50 to-teal-50",
            darkBg: "from-emerald-900/20 to-teal-900/20",
        },
        {
            icon: Mail,
            title: "Email",
            subtitle: "We're here to help",
            details: "habtebiruk13@gmail.com",
            gradient: "from-violet-500 to-purple-600",
            lightBg: "from-violet-50 to-purple-50",
            darkBg: "from-violet-900/20 to-purple-900/20",
            action: "mailto:habtebiruk13@gmail.com"
        },
        {
            icon: Clock,
            title: "Response Time",
            subtitle: "Quick turnaround",
            details: "Usually within 24 hours",
            gradient: "from-amber-500 to-orange-600",
            lightBg: "from-amber-50 to-orange-50",
            darkBg: "from-amber-900/20 to-orange-900/20",
        },
    ];

    const socialLinks = [
        { 
            icon: Linkedin, 
            name: "LinkedIn", 
            url: "http://www.linkedin.com/in/biruk-habte-ab9642295", 
            gradient: "from-blue-600 to-blue-700",
            handle: "@biruk-habte"
        },
        { 
            icon: Github, 
            name: "GitHub", 
            url: "https://github.com/birukhabte", 
            gradient: "from-gray-700 to-gray-900",
            handle: "@birukhabte"
        },
    ];

    const faqData = [
        {
            id: "timing",
            question: "When is the best time to visit Ethiopia?",
            answer: "October to February offers clear skies and mild temperatures—perfect for Lalibela, the Simien Mountains, and coffee farm tours. June to September is the rainy season, great for lush landscapes but expect showers."
        },
        {
            id: "visa",
            question: "Do I need a visa to enter Ethiopia?",
            answer: "Most visitors need a tourist visa. Ethiopia offers e-Visa options (30 or 90 days) for many nationalities—apply online and typically receive approval within 3 business days."
        },
        {
            id: "places",
            question: "Which Ethiopian destinations should I prioritize?",
            answer: "Don't miss Lalibela's rock-hewn churches, the castles of Gondar, the Danakil Depression, the Bale and Simien Mountains, and Addis Ababa's vibrant museums and coffee culture."
        },
        {
            id: "language",
            question: "Will language be a challenge in Ethiopia?",
            answer: "Amharic is the official language, but English is widely spoken in Addis Ababa, tourist hubs, and by guides. Many locals also speak Oromo, Tigrinya, or other regional languages."
        },
        {
            id: "currency",
            question: "What currency is used and how should I pay?",
            answer: "Ethiopian Birr (ETB) is the currency. Carry cash for markets and rural areas; ATMs and card payments are common in Addis Ababa and major hotels."
        },
    ];

    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    return (
        <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-stone-50'}`}>
            
            {/* Light Mode - Warm Aesthetic Background */}
            {!isDark && (
                <div className="fixed inset-0 pointer-events-none">
                    {/* Warm gradient base */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-stone-50 to-rose-50/60"></div>
                    
                    {/* Animated warm orbs */}
                    <motion.div
                        animate={{ 
                            x: [0, 40, 0], 
                            y: [0, -30, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-200/50 to-orange-200/40 blur-3xl"
                    ></motion.div>
                    <motion.div
                        animate={{ 
                            x: [0, -50, 0], 
                            y: [0, 40, 0],
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-rose-200/40 to-pink-200/30 blur-3xl"
                    ></motion.div>
                    <motion.div
                        animate={{ 
                            x: [0, 30, 0], 
                            y: [0, -40, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                        className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-violet-200/30 to-indigo-200/20 blur-3xl"
                    ></motion.div>
                    
                    {/* Decorative lines */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-300/40 to-transparent"></div>
                    
                    {/* Subtle grid pattern */}
                    <div 
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(to right, #92400e 1px, transparent 1px), linear-gradient(to bottom, #92400e 1px, transparent 1px)`,
                            backgroundSize: '60px 60px',
                        }}
                    ></div>
                    
                    {/* Corner decorations */}
                    <div className="absolute top-20 left-20 w-40 h-40 border border-amber-200/40 rounded-full"></div>
                    <div className="absolute top-24 left-24 w-32 h-32 border border-amber-200/30 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-48 h-48 border border-rose-200/30 rounded-full"></div>
                    <div className="absolute bottom-28 right-28 w-32 h-32 border border-rose-200/20 rounded-full"></div>
                </div>
            )}
            
            {/* Dark Mode Background */}
            {isDark && (
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-gradient-to-br from-amber-600 to-orange-600"></div>
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 bg-gradient-to-tl from-violet-600 to-purple-600"></div>
                    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-rose-600 to-pink-600"></div>
                    
                    <div className="absolute inset-0 opacity-[0.02]" 
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                            backgroundSize: '40px 40px',
                        }}
                    ></div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-28 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        {/* Decorative element */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="inline-flex items-center justify-center mb-8"
                        >
                            <div className={`relative p-4 rounded-2xl ${isDark ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' : 'bg-gradient-to-br from-amber-100 to-orange-100'}`}>
                                <Sparkles className={`w-8 h-8 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                                <div className="absolute inset-0 rounded-2xl animate-pulse bg-gradient-to-br from-amber-400/20 to-orange-400/20"></div>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>
                            <span className="block">Let's</span>
                            <span className={`bg-gradient-to-r ${isDark ? 'from-amber-400 via-orange-400 to-rose-400' : 'from-amber-600 via-orange-600 to-rose-600'} bg-clip-text text-transparent`}>
                                Connect
                            </span>
                        </h1>

                        <p className={`text-lg md:text-xl max-w-xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                            Questions about exploring India? We're passionate about helping you discover its wonders.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="relative px-4 pb-16">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contactCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className="group relative"
                            >
                                {card.action ? (
                                    <a href={card.action} className="block h-full">
                                        <CardContent card={card} index={index} hoveredCard={hoveredCard} isDark={isDark} />
                                    </a>
                                ) : (
                                    <CardContent card={card} index={index} hoveredCard={hoveredCard} isDark={isDark} />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Two Column: Social + Map */}
            <section className="relative px-4 pb-16">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        
                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="lg:col-span-2"
                        >
                            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                Follow Along
                            </h2>
                            <div className="space-y-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ x: 8, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 ${
                                            isDark 
                                                ? 'bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50' 
                                                : 'bg-white/80 hover:bg-white border border-stone-200/50 shadow-lg shadow-stone-200/20 hover:shadow-xl'
                                        }`}
                                    >
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${social.gradient} flex items-center justify-center shadow-lg`}>
                                            <social.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                                {social.name}
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
                                                {social.handle}
                                            </p>
                                        </div>
                                        <ArrowRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-stone-400'} group-hover:translate-x-1 transition-transform`} />
                                    </motion.a>
                                ))}
                            </div>
                            
                            {/* Quick Email CTA */}
                            <motion.a
                                href="mailto:habtebiruk13@gmail.com"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`mt-6 flex items-center justify-center gap-3 p-4 rounded-2xl font-semibold transition-all duration-300 bg-gradient-to-r ${
                                    isDark 
                                        ? 'from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20' 
                                        : 'from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                }`}
                            >
                                <Send className="w-5 h-5" />
                                Send us an email
                            </motion.a>
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className={`lg:col-span-3 rounded-3xl overflow-hidden ${
                                isDark 
                                    ? 'bg-gray-800/60 border border-gray-700/50' 
                                    : 'bg-white/80 border border-stone-200/50 shadow-xl shadow-stone-200/20'
                            }`}
                        >
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse`}></div>
                                    <span className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                        {userLocation ? 'Your Current Location' : 'Addis Ababa, Ethiopia'}
                                    </span>
                                </div>
                                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-stone-400'}`}>
                                    Our Location
                                </span>
                            </div>
                            <div className="h-72 relative">
                                <iframe
                                    src={userLocation
                                        ? `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=14&output=embed`
                                        : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.181579592468!2d38.74424647683204!3d8.980603390645192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85bfe6a32b8f%3A0x5d6e7ca3a0655e24!2sMeskel%20Square!5e0!3m2!1sen!2set!4v1743274800000!5m2!1sen!2set"}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Our Location"
                                    className={""}
                                ></iframe>
                                {locationError && (
                                    <p className={`absolute bottom-4 right-4 text-xs rounded-md px-3 py-1 ${isDark ? 'bg-gray-900/80 text-gray-300' : 'bg-white/90 text-stone-600'}`}>
                                        {locationError}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative px-4 pb-20">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="text-center mb-10">
                            <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                Common Questions
                            </h2>
                            <p className={`${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                                Quick answers about traveling to India
                            </p>
                        </div>

                        <div className="space-y-3 max-w-3xl mx-auto">
                            {faqData.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                                        isDark 
                                            ? 'bg-gray-800/60 border border-gray-700/50' 
                                            : 'bg-white/80 border border-stone-200/50 shadow-lg shadow-stone-100'
                                    } ${expandedFaq === faq.id ? isDark ? 'ring-2 ring-amber-500/30' : 'ring-2 ring-amber-400/50' : ''}`}
                                >
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className={`w-full p-5 text-left flex justify-between items-center gap-4`}
                                    >
                                        <span className={`font-medium leading-snug ${isDark ? 'text-white' : 'text-stone-900'}`}>
                                            {faq.question}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                                expandedFaq === faq.id
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                                    : isDark ? 'bg-gray-700 text-gray-400' : 'bg-stone-100 text-stone-500'
                                            }`}
                                        >
                                            <ChevronDown size={18} />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence mode="wait">
                                        {expandedFaq === faq.id && (
                                            <motion.div
                                                key={`answer-${faq.id}`}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className={`px-5 pb-5 pt-0 leading-relaxed ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

// Separate CardContent component for cleaner code
const CardContent = ({ card, index, hoveredCard, isDark }) => (
    <div className={`h-full p-6 rounded-3xl transition-all duration-500 border ${
        isDark 
            ? `bg-gradient-to-br ${card.darkBg} border-gray-700/50 ${hoveredCard === index ? 'border-gray-600 scale-[1.02]' : ''}` 
            : `bg-gradient-to-br ${card.lightBg} border-stone-200/50 shadow-lg ${hoveredCard === index ? 'shadow-xl scale-[1.02] border-stone-300/50' : 'shadow-stone-100'}`
    }`}>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-5 shadow-lg ${hoveredCard === index ? 'scale-110' : ''} transition-transform duration-300`}>
            <card.icon className="w-6 h-6 text-white" />
        </div>
        <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {card.title}
        </h3>
        <p className={`text-sm mb-3 ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>
            {card.subtitle}
        </p>
        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
            {card.details}
        </p>
    </div>
);

export default ContactUs;
