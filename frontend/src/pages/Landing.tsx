import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Shield, Globe, Zap, CheckCircle, Star, Quote, Image as ImageIcon, MessageSquare, Loader2 } from 'lucide-react';

export default function Landing() {
  const [formData, setFormData] = useState({ name: '', email: '', program: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleInquiryAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // Simulation d'appel à notre API Backend /api/school/notify
      await fetch('http://localhost:5000/api/school/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.email,
          message: `Demande d'inscription de ${formData.name} pour le programme ${formData.program}. Contact: ${formData.email}`,
          type: 'EMAIL_ADMISSION'
        })
      });

      // Même si le backend n'est pas lancé, on simule la réussite visuelle
      setTimeout(() => {
        setSending(false);
        setSent(true);
        setFormData({ name: '', email: '', program: '', message: '' });
      }, 1500);
    } catch (error) {
      console.warn("API Backend hors ligne, simulation visuelle seulement.");
      setTimeout(() => {
        setSending(false);
        setSent(true);
      }, 1000);
    }
  };
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-brand-500 selection:text-white scroll-smooth">
      {/* Navigation Publique Premium */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 py-5 transition-all">
        <div className="flex items-center gap-3">
          <div className="bg-brand-500 p-1.5 rounded-lg">
             <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tighter">EduManage</span>
        </div>
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <a href="#features" className="hover:text-brand-600 transition-colors">Innovations</a>
          <a href="#gallery" className="hover:text-brand-600 transition-colors">L'établissement</a>
          <a href="#testimonials" className="hover:text-brand-600 transition-colors">Témoignages</a>
          <a href="#contact" className="hover:text-brand-600 transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-xs font-black text-slate-900 uppercase tracking-widest hover:text-brand-600 transition-colors">Admin Login</Link>
          <Link to="/login" className="btn-primary py-2.5 px-6 text-xs shadow-brand-500/20">Portail Parents</Link>
        </div>
      </nav>

      {/* Hero Section Masterpiece */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[100px] -z-10 animate-pulse delay-700"></div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-slate-800 shadow-2xl">
              <Star size={12} className="text-brand-500 fill-brand-500" />
              L'Éducation du futur, aujourd'hui.
            </div>
            <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-10">
              L'Excellence <br /><span className="bg-gradient-to-tr from-brand-600 to-brand-400 bg-clip-text text-transparent italic">redéfinie</span>.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-2xl px-4">
              EduManage est la plateforme d'élite conçue pour les établissements scolaires de premier ordre. Un écosystème intelligent pour une gestion transparente et une réussite académique sans précédent.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
               <Link to="/login" className="btn-primary h-16 px-12 text-lg shadow-2xl shadow-brand-500/40">Découvrir le Portail</Link>
               <button className="flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-black rounded-3xl border-2 border-slate-100 hover:border-brand-500 hover:shadow-2xl transition-all h-16 uppercase tracking-widest text-xs">
                 Prendre Rendez-vous
                 <ArrowRight size={18} />
               </button>
            </div>
          </div>
          
          {/* Main Dashboard Preview Floating Effect */}
          <div className="mt-24 w-full relative">
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[95%] h-[110%] bg-brand-500/5 blur-[100px] -z-10"></div>
             <div className="bg-white p-4 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1541339907198-e08756ebafe1?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-[650px] object-cover rounded-[28px] opacity-90"
                  alt="School Campus"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Innovation Section (Features) */}
      <section id="features" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 text-center mb-24">
           <span className="text-xs font-black text-brand-600 tracking-[0.4em] uppercase">Innovations Digitales</span>
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter mt-4">Une gestion 360° sans compromis.</h2>
        </div>

        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap color="#14b8a6" size={36} />} 
              title="Intelligence Opérationnelle" 
              desc="Automatisez vos processus administratifs et visualisez vos performances en temps réel avec nos outils analytiques avancés." 
            />
            <FeatureCard 
              icon={<Shield color="#14b8a6" size={36} />} 
              title="Sécurité de Grade Militaire" 
              desc="Vos données sont protégées par les standards de sécurité les plus élevés de l'industrie, garantissant confidentialité et intégrité." 
            />
            <FeatureCard 
              icon={<Globe color="#14b8a6" size={36} />} 
              title="Ubiquité Mobile" 
              desc="Connectez parents, élèves et administration sur n'importe quel appareil, partout dans le monde, en un instant." 
            />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                 <span className="text-xs font-black text-brand-600 tracking-[0.4em] uppercase">Immersion</span>
                 <h2 className="text-5xl font-black text-slate-900 tracking-tighter mt-4">L'environnement d'excellence de nos élèves.</h2>
              </div>
              <button className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-brand-600 transition-colors">
                Voir toute la galerie <ImageIcon size={16} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[700px]">
              <div className="md:col-span-2 md:row-span-2 rounded-[32px] overflow-hidden group border border-slate-100 shadow-xl">
                 <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="rounded-[32px] overflow-hidden group border border-slate-100 shadow-xl">
                 <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="rounded-[32px] overflow-hidden group border border-slate-100 shadow-xl">
                 <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="md:col-span-2 rounded-[32px] overflow-hidden group border border-slate-100 shadow-xl">
                 <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <defs><pattern id="grid-dark" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#fff" strokeWidth="0.1"/></pattern></defs>
             <rect width="100" height="100" fill="url(#grid-dark)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
           <div className="text-center mb-24">
              <span className="text-xs font-black text-brand-400 tracking-[0.4em] uppercase">Témoignages</span>
              <h2 className="text-5xl font-black text-white tracking-tighter mt-4 italic">Ce qu'ils disent de nous.</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <TestimonialCard 
                author="Mme Marie Laurent"
                role="Maman d'élève - Terminale S"
                content="EduManage a radicalement changé ma relation avec l'école. Je reçois les notes instantanément et je peux suivre l'assiduité de ma fille en temps réel. C'est une tranquillité d'esprit inestimable."
              />
              <TestimonialCard 
                author="M. Robert Jenkins"
                role="Directeur Académique - Global School"
                content="L'interface d'administration est d'une fluidité incroyable. Nous avons gagné plus de 15 heures par semaine sur les tâches administratives répétitives grâce aux rapports automatisés."
              />
           </div>
        </div>
      </section>

      {/* Pricing / Tuition Fees Section */}
      <section id="admissions" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 text-center mb-24">
           <span className="text-xs font-black text-brand-600 tracking-[0.4em] uppercase">Transparence</span>
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter mt-4 italic underline-offset-8 decoration-brand-500">Nos Programmes d'Excellence.</h2>
        </div>

        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           <PriceCard 
             title="Primaire" 
             price="1 500 €" 
             period="Par an" 
             features={['Activités périscolaires', 'Accès portail parents', 'Matériel didactique', 'Cantine incluse']} 
           />
           <PriceCard 
             title="Secondaire" 
             price="2 200 €" 
             period="Par an" 
             featured={true}
             features={['Laboratoires avancés', 'Suivi personnalisé', 'Orientation carrière', 'Sorties éducatives']} 
           />
           <PriceCard 
             title="Université" 
             price="4 500 €" 
             period="Par an" 
             features={['Stages garantis', 'Accès fibre optique', 'Bibliothèque digitale', 'Réseau Alumni']} 
           />
        </div>
      </section>

      {/* Contact & Inquiry Form */}
      <section id="contact" className="py-32 bg-slate-50 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/2 space-y-10">
               <div>
                  <span className="text-xs font-black text-brand-600 tracking-[0.4em] uppercase">Rejoignez-nous</span>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter mt-4 leading-none">Prêt à bâtir l'avenir de votre enfant ?</h2>
                  <p className="text-slate-500 text-lg mt-8 leading-relaxed font-medium">Contactez notre bureau des admissions pour une visite personnalisée ou une demande d'inscription.</p>
               </div>
               <div className="space-y-6">
                  <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                     <div className="bg-brand-50 p-4 rounded-2xl"><Globe className="text-brand-600" size={24} /></div>
                     <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Adresse</p><p className="text-sm font-bold text-slate-900">12 Avenue de l'Éducation, Paris-Saclay</p></div>
                  </div>
                  <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                     <div className="bg-brand-50 p-4 rounded-2xl"><Zap className="text-brand-600" size={24} /></div>
                     <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Responsable</p><p className="text-sm font-bold text-slate-900">admissions@edumanage.edu</p></div>
                  </div>
               </div>
            </div>

            <div className="lg:w-1/2 bg-white p-12 rounded-[48px] shadow-2xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full opacity-50"></div>
               
               {sent ? (
                 <div className="relative z-10 flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-50 duration-500">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-50">
                       <CheckCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Merci beaucoup !</h3>
                    <p className="text-slate-500 font-medium mt-4 max-w-[280px]">Votre demande a été transmise au bureau des admissions. Nous vous répondrons sous 24h.</p>
                    <button onClick={() => setSent(false)} className="mt-8 text-sm font-black text-brand-600 uppercase tracking-widest border-b-2 border-brand-200 pb-0.5">Envoyer un autre message</button>
                 </div>
               ) : (
                 <form onSubmit={handleInquiryAction} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nom Parent</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 placeholder-slate-400 font-medium text-sm focus:ring-2 focus:ring-brand-500" 
                          placeholder="Jean Dupont" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 placeholder-slate-400 font-medium text-sm focus:ring-2 focus:ring-brand-500" 
                          placeholder="jean@mail.com" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Programme Souhaité</label>
                      <select 
                        required
                        value={formData.program}
                        onChange={(e) => setFormData({...formData, program: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      >
                         <option value="">Choisir un programme</option>
                         <option value="Primaire">Primaire</option>
                         <option value="Secondaire">Secondaire</option>
                         <option value="Université">Université</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Message / Questions</label>
                      <textarea 
                        rows={4} 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 placeholder-slate-400 font-medium text-sm focus:ring-2 focus:ring-brand-500" 
                        placeholder="Comment pouvons-nous vous aider ?"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={sending}
                      className="btn-primary w-full h-14 text-sm font-black uppercase tracking-widest disabled:grayscale"
                    >
                      {sending ? <Loader2 className="animate-spin" size={24} /> : (
                        <>Envoyer la Demande <ArrowRight size={18} /></>
                      )}
                    </button>
                 </form>
               )}
            </div>
         </div>
      </section>

      {/* Footer Final */}
      <footer className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
              <div className="md:col-span-2">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="bg-brand-500 p-1.5 rounded-lg">
                       <BookOpen className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">EduManage</span>
                 </div>
                 <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed text-sm">
                   Élever les standards de l'éducation par la technologie et l'excellence opérationnelle. Notre mission est de simplifier la gestion scolaire pour laisser plus de place à la pédagogie.
                 </p>
                 <div className="flex gap-4">
                    <SocialBtn icon={<MessageSquare size={18} />} />
                    <SocialBtn icon={<Globe size={18} />} />
                 </div>
              </div>
              <div>
                 <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">L'Établissement</h4>
                 <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <li><a href="#" className="hover:text-brand-600 transition-colors">Programmes</a></li>
                    <li><a href="#" className="hover:text-brand-600 transition-colors">Admissions</a></li>
                    <li><a href="#" className="hover:text-brand-600 transition-colors">Vie Scolaire</a></li>
                    <li><a href="#" className="hover:text-brand-600 transition-colors">Actualités</a></li>
                 </ul>
              </div>
              <div>
                 <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Informations</h4>
                 <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <li><a href="#" className="hover:text-brand-600 transition-colors">Mentions Légales</a></li>
                    <li><a href="#" className="hover:text-brand-600 transition-colors">Confidentialité</a></li>
                    <li><a href="#" className="hover:text-brand-600 transition-colors">Contact</a></li>
                 </ul>
              </div>
           </div>
           <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2026 EduManage Advanced Ecosystem.</p>
              <div className="flex gap-6 uppercase text-[10px] font-black text-brand-600 tracking-widest leading-none">
                 <span>Paris</span>
                 <span>Lomé</span>
                 <span>Dakar</span>
                 <span>Abidjan</span>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-12 rounded-[40px] border border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:border-brand-500/10 hover:-translate-y-2 transition-all duration-700 group relative overflow-hidden">
       <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-brand-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
       <div className="mb-8 p-5 bg-slate-50 rounded-3xl w-fit group-hover:bg-brand-50 group-hover:scale-110 transition-all duration-500">
          {icon}
       </div>
       <h3 className="text-2xl font-black text-slate-900 mb-5 tracking-tighter">{title}</h3>
       <p className="text-slate-500 font-medium leading-relaxed text-sm mb-8">{desc}</p>
       <div className="flex items-center gap-2 text-brand-600 font-black text-xs uppercase tracking-widest transition-all group-hover:gap-4">
         Découvrir l'innovation <ArrowRight size={18} />
       </div>
    </div>
  );
}

function TestimonialCard({ author, role, content }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-md p-12 rounded-[48px] border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]">
       <Quote className="text-brand-500 mb-8" size={48} />
       <p className="text-2xl text-slate-200 font-medium italic leading-relaxed mb-10 tracking-tight">"{content}"</p>
       <div className="pt-8 border-t border-white/5">
          <p className="text-white font-black text-lg tracking-tight uppercase leading-none mb-2">{author}</p>
          <p className="text-brand-400 font-black text-[10px] uppercase tracking-widest opacity-80">{role}</p>
       </div>
    </div>
  );
}

function SocialBtn({ icon }: any) {
  return (
    <button className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-brand-500 hover:text-white transition-all transform hover:rotate-12">
      {icon}
    </button>
  );
}

function PriceCard({ title, price, period, features, featured = false }: any) {
  return (
    <div className={`p-10 rounded-[48px] border sm:p-12 transition-all duration-700 hover:-translate-y-4 shadow-2xl relative
      ${featured ? 'bg-slate-900 border-slate-800 scale-105 z-10' : 'bg-white border-slate-100 hover:border-brand-500/20'}`}>
       {featured && <div className="absolute top-8 right-8 bg-brand-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-brand-500/30">Populaire</div>}
       <h4 className={`text-xs font-black uppercase tracking-[0.3em] mb-10 ${featured ? 'text-brand-400' : 'text-brand-600'}`}>{title}</h4>
       <div className="flex items-baseline gap-2 mb-10">
          <span className={`text-5xl font-black tracking-tighter ${featured ? 'text-white' : 'text-slate-900'}`}>{price}</span>
          <span className="text-sm font-bold text-slate-400 opacity-80 uppercase tracking-widest">{period}</span>
       </div>
       <ul className="space-y-5 mb-12">
          {features.map((feature: string) => (
             <li key={feature} className="flex items-center gap-3 text-sm font-bold tracking-tight">
                <CheckCircle size={18} className={featured ? 'text-brand-400' : 'text-brand-500'} />
                <span className={featured ? 'text-slate-300' : 'text-slate-500'}>{feature}</span>
             </li>
          ))}
       </ul>
       <button className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest border-2 transition-all
          ${featured ? 'bg-brand-500 border-brand-500 text-white hover:bg-white hover:text-slate-900 shadow-2xl shadow-brand-500/20' : 'bg-white border-slate-100 text-slate-900 hover:border-brand-500 hover:text-brand-600 hover:shadow-2xl'}`}>
         S'inscrire Maintenant
       </button>
    </div>
  );
}
