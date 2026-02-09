import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Sparkles, Brain, Target, Zap, Rocket, LineChart } from 'lucide-react';
import Hero from '../hero';

const HomePage = () => {
  const scrollToAnalyze = () => {
    // Navigate to analyze page
    window.location.href = '/analyze';
  };

  return (
    <>
      <Hero />
      
      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm"
          >
            <Rocket className="w-12 h-12" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Problem-Solving Journey Today
          </h2>
          
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands who found clarity with AI-powered analysis. No sign-up required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToAnalyze}
              className="px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
            >
              <Zap className="w-6 h-6" />
              START NOW - It's Free
            </motion.button>
            
            <Link to="/strategy">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              >
                <LineChart className="w-6 h-6" />
                View Strategy
              </motion.button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm opacity-80">
            No credit card • No registration • 100% private
          </p>
        </div>
      </motion.section>
    </>
  );
};

export default HomePage;