import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const jornadas = [
  { city: 'Soatá', date: '15-16 Nov', desc: 'Centro Médico Integral, Calle Principal', color: 'from-primary/30 to-primary-container/10' },
  { city: 'Muzo', date: '22 Nov', desc: 'Salón Comunal - Sector Centro', color: 'from-secondary/20 to-secondary-container/10' },
  { city: 'Chiquinquirá', date: '29 Nov', desc: 'Consultorio 302, Edificio Alianza', color: 'from-tertiary/20 to-tertiary-container/10' },
];

export default function JornadasSection() {
  return (
    <section id="jornadas" className="py-24 bg-surface-container">
      <div className="container mx-auto px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-on-surface">Próximas Jornadas en Boyacá</h2>
            <p className="text-on-surface-variant">Llevamos la atención de alta calidad a tu comunidad. Reserva tu cupo con anticipación, los espacios son limitados.</p>
          </div>
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-2 text-primary font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Inscripciones Abiertas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {jornadas.map((j, i) => (
            <motion.div
              key={j.city}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`h-48 overflow-hidden relative bg-gradient-to-br ${j.color}`}>
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin size={48} className="text-primary/30" />
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold shadow-sm text-on-surface">
                  {j.date}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 text-on-surface">{j.city}</h3>
                <p className="text-on-surface-variant text-sm mb-6">{j.desc}</p>
                <a
                  href={`https://wa.me/573112345678?text=Hola%2C%20quiero%20reservar%20cupo%20para%20la%20jornada%20en%20${j.city}`}
                  target="_blank"
                  rel="noopener"
                  className="w-full py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-on-primary transition-all block text-center"
                >
                  Reserva tu cupo
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
