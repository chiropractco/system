import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Catalina Forero',
    role: 'Paciente desde hace 2 años',
    text: 'Después de meses con dolor lumbar, las sesiones con el Dr. Miguel fueron un cambio total. Su enfoque profesional y las explicaciones claras me dieron mucha confianza.',
    border: 'border-primary',
    bg: 'bg-surface-container-lowest',
  },
  {
    name: 'Jairo Rodríguez',
    role: 'Jornada Boyacá',
    text: 'Excelente atención en la jornada de Soatá. Me ahorró el viaje a Bogotá y el tratamiento fue impecable. Totalmente recomendado.',
    border: 'border-secondary',
    bg: 'bg-surface-container-lowest',
  },
  {
    name: 'Ana María López',
    role: 'Quiropraxia deportiva',
    text: 'Mi lesión de hombro mejoró dramáticamente en solo 3 sesiones. Pude volver a entrenar sin dolor. El Dr. Díaz entiende el cuerpo del atleta.',
    border: 'border-tertiary',
    bg: 'bg-surface-container-lowest',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-8 text-on-surface">Testimonios de Pacientes</h2>
            <div className="space-y-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  className={`${t.bg} p-8 rounded-xl shadow-sm border-l-4 ${t.border}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex gap-1 mb-4 text-tertiary-fixed-dim">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-xl italic text-on-surface mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-sm font-bold text-primary">
                      {t.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{t.name}</p>
                      <p className="text-sm text-on-surface-variant">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl relative bg-gradient-to-br from-primary/10 to-primary-container/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full clinical-gradient flex items-center justify-center mx-auto mb-4 text-on-primary">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.607 6.847a1.125 1.125 0 010 1.972l-11.607 6.847a1.125 1.125 0 01-1.667-.986V5.653z" />
                  </svg>
                </div>
                <p className="text-on-surface-variant text-sm font-medium">Vea cómo transformamos vidas</p>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-on-surface-variant italic">A través de la quiropraxia clínica.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
