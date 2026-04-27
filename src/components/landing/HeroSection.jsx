import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { wa } from '../../lib/clinic';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-8 z-10 grid md:grid-cols-2 gap-12 items-center max-w-7xl">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-medium gap-2">
              <ShieldCheck size={14} />
              Clinical Precision in Bogotá & Boyacá
            </span>
          </motion.div>

          <motion.h1
            className="editorial-title text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Tu bienestar empieza con una buena <span className="text-primary">alineación</span>
          </motion.h1>

          <motion.p
            className="text-xl text-on-surface-variant max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Quiropraxia profesional en Bogotá y jornadas en Boyacá. Restauramos tu salud estructural con técnicas avanzadas y cuidado personalizado.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <a
              href={wa.schedule()}
              target="_blank"
              rel="noopener"
              className="clinical-gradient text-on-primary px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all text-center"
            >
              Agendar Cita
            </a>
            <a
              href="#jornadas"
              className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl text-lg font-bold hover:bg-surface-container-highest transition-colors text-center"
            >
              Ver Jornadas
            </a>
          </motion.div>
        </div>

        <div className="relative hidden md:flex items-center justify-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl" />
            <div className="relative aspect-square max-w-md rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary-container/10 to-surface flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full clinical-gradient flex items-center justify-center text-on-primary mx-auto">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.37.747A2.25 2.25 0 0116.559 17H7.441a2.25 2.25 0 01-.871-.953L5 14.5m14.8.8l1.402 1.152a1.5 1.5 0 01-.42 2.61l-2.1.672a1.5 1.5 0 01-1.256-.218l-.75-.507M5 14.5l-1.402 1.152a1.5 1.5 0 00.42 2.61l2.1.672a1.5 1.5 0 001.256-.218l.75-.507m6.852-2.507l-.75.507m-6.852-2.507l.75.507" />
                    </svg>
                  </div>
                  <p className="text-on-surface-variant text-sm font-medium">Spine Animation</p>
                  <p className="text-on-surface-variant/60 text-xs">Scroll to explore</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full clinical-gradient flex items-center justify-center text-on-primary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">15+ Años</div>
                <div className="text-sm text-on-surface-variant uppercase tracking-wider font-semibold">Experiencia</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
