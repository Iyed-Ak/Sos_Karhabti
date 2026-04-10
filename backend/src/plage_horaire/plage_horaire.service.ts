import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlageHoraire, JourSemaine } from './entities/plage_horaire.entity';
import { CreatePlageHoraireDto } from './dto/create-plage_horaire.dto';
import { UpdatePlageHoraireDto } from './dto/update-plage_horaire.dto';

@Injectable()
export class PlageHoraireService {
  constructor(
    @InjectRepository(PlageHoraire)
    private plageHoraireRepository: Repository<PlageHoraire>,
  ) {}

  async create(createDto: CreatePlageHoraireDto): Promise<any> {
    // Vérifier chevauchement d'horaires pour le même camion et même jour
    const existing = await this.plageHoraireRepository.find({
      where: {
        camionId: createDto.camionId,
        jourSemaine: createDto.jourSemaine,
        estActif: true,
      },
    });

    // Vérification simple de chevauchement
    for (const plage of existing) {
      const debutExistant = plage.heureDebut;
      const finExistante = plage.heureFin;
      const debutNew = createDto.heureDebut;
      const finNew = createDto.heureFin;

      if (
        (debutNew >= debutExistant && debutNew < finExistante) ||
        (finNew > debutExistant && finNew <= finExistante) ||
        (debutNew <= debutExistant && finNew >= finExistante)
      ) {
        return {
          success: false,
          message: `❌ Chevauchement détecté avec une plage existante (${debutExistant} - ${finExistante})`,
        };
      }
    }

    const plage = this.plageHoraireRepository.create(createDto);
    const saved = await this.plageHoraireRepository.save(plage);

    return {
      success: true,
      message: '✅ Plage horaire créée avec succès',
      data: saved,
    };
  }

  async findAll(): Promise<any> {
    const plages = await this.plageHoraireRepository.find({
      order: { jourSemaine: 'ASC', heureDebut: 'ASC' },
      // relations: ['camion'],
    });

    return {
      success: true,
      message: `📋 ${plages.length} plage(s) horaire(s) trouvée(s)`,
      count: plages.length,
      data: plages,
    };
  }

  async findByCamion(camionId: number): Promise<any> {
    const plages = await this.plageHoraireRepository.find({
      where: { camionId },
      order: { jourSemaine: 'ASC', heureDebut: 'ASC' },
    });

    return {
      success: true,
      message: `📋 ${plages.length} plage(s) pour le camion #${camionId}`,
      count: plages.length,
      data: plages,
    };
  }

  async findByJour(jour: JourSemaine): Promise<any> {
    const plages = await this.plageHoraireRepository.find({
      where: { jourSemaine: jour, estActif: true },
      order: { heureDebut: 'ASC' },
      // relations: ['camion'],
    });

    return {
      success: true,
      message: `📋 ${plages.length} plage(s) pour le ${jour}`,
      count: plages.length,
      data: plages,
    };
  }

  async findOne(id: number): Promise<any> {
    const plage = await this.plageHoraireRepository.findOne({ where: { id } });

    if (!plage) {
      return {
        success: false,
        message: `❌ Plage horaire avec l'ID ${id} non trouvée`,
      };
    }

    return {
      success: true,
      message: '✅ Plage horaire trouvée',
      data: plage,
    };
  }

  async update(id: number, updateDto: UpdatePlageHoraireDto): Promise<any> {
    const plage = await this.plageHoraireRepository.findOne({ where: { id } });

    if (!plage) {
      return {
        success: false,
        message: `❌ Plage horaire avec l'ID ${id} non trouvée`,
      };
    }

    Object.assign(plage, updateDto);
    const updated = await this.plageHoraireRepository.save(plage);

    return {
      success: true,
      message: '✅ Plage horaire mise à jour',
      data: updated,
    };
  }

  async remove(id: number): Promise<any> {
    const plage = await this.plageHoraireRepository.findOne({ where: { id } });

    if (!plage) {
      return {
        success: false,
        message: `❌ Plage horaire avec l'ID ${id} non trouvée`,
      };
    }

    await this.plageHoraireRepository.remove(plage);

    return {
      success: true,
      message: '✅ Plage horaire supprimée',
      deletedId: id,
    };
  }

  // Vérifier si un camion est disponible à un moment donné
  async verifierDisponibilite(
    camionId: number,
    dateHeure: Date,
  ): Promise<any> {
    const jours = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const jourActuel = jours[dateHeure.getDay()] as JourSemaine;
    const heureActuelle = `${String(dateHeure.getHours()).padStart(2, '0')}:${String(dateHeure.getMinutes()).padStart(2, '0')}`;

    const plages = await this.plageHoraireRepository.find({
      where: {
        camionId,
        jourSemaine: jourActuel,
        estActif: true,
      },
    });

    const disponible = plages.some(
      (p) => heureActuelle >= p.heureDebut && heureActuelle <= p.heureFin,
    );

    return {
      success: true,
      camionId,
      jourActuel,
      heureActuelle,
      disponible,
      message: disponible
        ? '✅ Le camion est disponible à cet horaire'
        : '❌ Le camion n\'est pas disponible à cet horaire',
    };
  }
}