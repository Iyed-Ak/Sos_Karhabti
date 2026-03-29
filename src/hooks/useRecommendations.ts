import { useState, useEffect } from 'react';
import { Vehicle } from '../context/VehicleContext';
import { maintenanceApi } from '../services/api';

export type RecPriority = 'high' | 'medium' | 'low';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: RecPriority;
  kmDue?: number;
  dateDue?: string;
  dealerNote?: string;
}

export function useRecommendations(vehicle: Vehicle | null, alertCount = 0, max = 2) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    let mounted = true;
    
    const loadRecommendations = async () => {
      if (!vehicle) {
        setRecommendations([]);
        return;
      }
      
      const km = vehicle.mileage;
      const recs: Recommendation[] = [];
      
      try {
        // 1. Fetch real maintenance history to check for user reminders
        const maintenanceHistory: any = await maintenanceApi.getAll(vehicle.id);
        
        let dynamicHighPriorityAdded = false;

        // Process actual reminders
        maintenanceHistory.forEach((record: any) => {
          if (record.reminderIntervalKm) {
            const kmDue = record.mileage + record.reminderIntervalKm;
            const kmRemaining = kmDue - km;
            
            // If overdue or due within 1000km, it's high priority
            if (kmRemaining <= 1000) {
              dynamicHighPriorityAdded = true;
              recs.push({
                id: `dynamic-${record.id}`,
                title: `Rappel : ${record.type}`,
                description: kmRemaining < 0 
                  ? `Dépassement de ${Math.abs(kmRemaining)} km depuis le dernier entretien programmé.`
                  : `Entretien prévu dans ${kmRemaining} km.`,
                priority: 'high',
                kmDue: kmDue,
                dealerNote: 'Planifiez votre rendez-vous dès maintenant.',
              });
            } else if (kmRemaining <= 3000) {
              recs.push({
                id: `dynamic-${record.id}`,
                title: `Prévision : ${record.type}`,
                description: `À prévoir dans ${kmRemaining.toLocaleString()} km.`,
                priority: 'medium',
                kmDue: kmDue,
              });
            }
          }
        });
        
        // 2. Add default recommendations if nothing urgent is pending
        if (!dynamicHighPriorityAdded) {
           
           // Seasonal Recommendations Context
           const month = new Date().getMonth(); // 0-11
           const isWinter = month === 11 || month === 0 || month === 1; // Dec, Jan, Feb
           const isSummer = month === 5 || month === 6 || month === 7; // Jun, Jul, Aug
           
           if (isWinter) {
             recs.push({
               id: 'seasonal-winter',
               title: 'Préparation Hivernale',
               description: 'Les températures baissent. Pensez à vérifier la batterie et envisager des pneus hiver.',
               priority: 'medium',
               dealerNote: 'Contrôle hiver gratuit en concession.',
             });
           } else if (isSummer) {
             recs.push({
               id: 'seasonal-summer',
               title: 'Contrôle Climatisation',
               description: 'L\'été approche, assurez-vous que votre circuit de climatisation est performant.',
               priority: 'medium',
             });
           }

           // Oil context block
           if (vehicle.fuelType !== 'electric') {
             // Determine optimal oil based on fuelType and mileage
             let oilType = '5W30'; // default modern choice
             if (vehicle.fuelType === 'diesel') {
               oilType = vehicle.mileage > 150000 ? '5W40' : '5W30 (Spécial FAP)';
             } else if (vehicle.fuelType === 'gasoline') {
               oilType = vehicle.mileage > 100000 ? '10W40' : '5W30';
             } else if (vehicle.fuelType === 'hybrid') {
               oilType = '0W20';
             }

             recs.push({
              id: 'defaultEngineOil',
              title: 'Contrôle de l\'huile',
              description: `Vérifiez le niveau d'huile régulièrement. Type recommandé pour votre moteur : ${oilType}.`,
              priority: 'medium',
              dealerNote: 'Inspection visuelle et remise à niveau.',
             });
           }

           // Contextual: High Mileage
           if (vehicle.mileage > 120000 && vehicle.fuelType !== 'electric') {
             recs.push({
               id: 'timing-belt',
               title: 'Courroie de distribution',
               description: `Votre véhicule a dépassé 120 000 km. Inspectez l'état de la courroie si elle n'a pas été changée.`,
               priority: 'high',
             });
           }

           // Contextual: Diesel
           if (vehicle.fuelType === 'diesel') {
             recs.push({
               id: 'adblue',
               title: 'Niveau d\'AdBlue & FAP',
               description: 'Un niveau d\'AdBlue bas peut bloquer le démarrage. Pensez à faire le plein et décrasser le FAP sur autoroute.',
               priority: 'medium',
             });
           }

           // Contextual: Gasoline
           if (vehicle.fuelType === 'gasoline' && (vehicle.mileage % 60000) > 40000) {
              recs.push({
                id: 'spark-plugs',
                title: 'Bougies d\'allumage',
                description: 'Le remplacement des bougies est conseillé tous les 60 000 km pour éviter une surconsommation.',
                priority: 'medium',
              });
           }

           // Contextual: Electric
           if (vehicle.fuelType === 'electric') {
              recs.push({
                id: 'ev-battery',
                title: 'Santé de la batterie haute tension',
                description: 'Évitez les charges répétées à 100% pour préserver la durée de vie des cellules.',
                priority: 'medium',
              });
              recs.push({
                id: 'ev-brakes',
                title: 'Liquide de frein (VE)',
                description: 'Le freinage régénératif économise les plaquettes, mais le liquide de frein doit être purgé tous les 2 ans.',
                priority: 'low',
              });
           }
           
           if (alertCount >= 2) {
             recs.push({
               id: 'alertBasedRec',
               title: 'Diagnostic complet conseillé',
               description: `Vous avez ${alertCount} alertes actives. Un diagnostic est suggéré.`,
               priority: 'high',
             });
           }
        }
        
        // 3. Always pad with some basic low priority tips
        if (vehicle.fuelType !== 'electric') {
          recs.push({
            id: 'tip-eco',
            title: 'Éco-conduite',
            description: 'Une conduite souple permet d\'économiser jusqu\'à 15% de carburant.',
            priority: 'low',
          });
        }
        
        recs.push({
          id: 'tip-pneus',
          title: 'Usure des pneus',
          description: 'Pression recommandée : 2.5 bar (avant) / 2.3 bar (arrière).',
          priority: 'low',
        });
        
        // Sort: high → medium → low
        const rank: Record<RecPriority, number> = { high: 0, medium: 1, low: 2 };
        const sorted = recs.sort((a, b) => rank[a.priority] - rank[b.priority]);
        
        if (mounted) {
          setRecommendations(sorted);
        }
      } catch (e) {
        console.error('Failed to load recommendations', e);
      }
    };

    loadRecommendations();
    
    return () => {
      mounted = false;
    };
  }, [vehicle?.mileage, vehicle?.id, alertCount]);

  const displayed = recommendations.slice(0, max);
  const hasMore = recommendations.length > max;

  return { recommendations, displayed, hasMore };
}
