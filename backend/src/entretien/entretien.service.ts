import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entretien, TypeEntretien } from './entities/entretien.entity';
import { CreateEntretienDto } from './dto/create-entretien.dto';
import { UpdateEntretienDto } from './dto/update-entretien.dto';

@Injectable()
export class EntretienService {
  constructor(
    @InjectRepository(Entretien)
    private entretienRepository: Repository<Entretien>,
  ) {}

  /**
   * Créer un nouvel entretien
   */
  async create(createEntretienDto: CreateEntretienDto): Promise<any> {
    const entretien = this.entretienRepository.create(createEntretienDto);
    const saved = await this.entretienRepository.save(entretien);
    
    return {
      success: true,
      message: '✅ Entretien créé avec succès !',
      data: saved,
    };
  }

  /**
   * Récupérer tous les entretiens
   */
  async findAll(): Promise<any> {
    const entretiens = await this.entretienRepository.find({
      order: { datePrevue: 'ASC' },
      // Relations à ajouter plus tard:
      // relations: ['vehicule'],
    });

    return {
      success: true,
      message: `📋 ${entretiens.length} entretien(s) trouvé(s)`,
      count: entretiens.length,
      data: entretiens,
    };
  }

  /**
   * Récupérer un entretien par son ID
   */
  async findOne(id: number): Promise<any> {
    const entretien = await this.entretienRepository.findOne({
      where: { id },
      // Relations à ajouter plus tard:
      // relations: ['vehicule'],
    });

    if (!entretien) {
      return {
        success: false,
        message: `❌ Entretien avec l'ID ${id} non trouvé`,
      };
    }

    return {
      success: true,
      message: '✅ Entretien trouvé',
      data: entretien,
    };
  }

  /**
   * Récupérer les entretiens par type
   */
  async findByType(type: TypeEntretien): Promise<any> {
    const entretiens = await this.entretienRepository.find({
      where: { type },
      order: { datePrevue: 'ASC' },
    });

    return {
      success: true,
      message: `📋 ${entretiens.length} entretien(s) de type ${type} trouvé(s)`,
      count: entretiens.length,
      data: entretiens,
    };
  }

  /**
   * Récupérer les entretiens à venir (non réalisés)
   */
  async findAVenir(): Promise<any> {
    const entretiens = await this.entretienRepository.find({
      where: { estRealise: false },
      order: { datePrevue: 'ASC' },
      // Relations à ajouter plus tard:
      // relations: ['vehicule'],
    });

    return {
      success: true,
      message: `📋 ${entretiens.length} entretien(s) à venir`,
      count: entretiens.length,
      data: entretiens,
    };
  }

  /**
   * Récupérer les entretiens réalisés
   */
  async findRealises(): Promise<any> {
    const entretiens = await this.entretienRepository.find({
      where: { estRealise: true },
      order: { dateRealisee: 'DESC' },
      // Relations à ajouter plus tard:
      // relations: ['vehicule'],
    });

    return {
      success: true,
      message: `📋 ${entretiens.length} entretien(s) réalisé(s)`,
      count: entretiens.length,
      data: entretiens,
    };
  }

  /**
   * Récupérer les entretiens d'un véhicule
   * À implémenter quand la relation avec Vehicule sera ajoutée
   */
  async findByVehicule(vehiculeId: number): Promise<any> {
    // TODO: Implémenter quand la relation avec Vehicule sera ajoutée
     const entretiens = await this.entretienRepository.find({
       where: { vehicule:{ id: vehiculeId }},
       order: { datePrevue: 'ASC' },
       relations: ['vehicule'],
     });
    
    return {
      success: true,
      message: `📋 ${entretiens.length} entretien(s) trouvé(s) pour le véhicule ${vehiculeId}`,
      count: entretiens.length,
      data: entretiens,
    };
  }

  /**
   * Mettre à jour un entretien
   */
  async update(id: number, updateEntretienDto: UpdateEntretienDto): Promise<any> {
    const entretien = await this.entretienRepository.findOne({ where: { id } });

    if (!entretien) {
      return {
        success: false,
        message: `❌ Entretien avec l'ID ${id} non trouvé`,
      };
    }

    Object.assign(entretien, updateEntretienDto);
    const updated = await this.entretienRepository.save(entretien);

    return {
      success: true,
      message: '✅ Entretien mis à jour avec succès !',
      data: updated,
    };
  }

  /**
   * Marquer un entretien comme réalisé
   */
  async marquerCommRealise(id: number, dateRealisee: Date, kilometrageRealise?: number, cout?: number): Promise<any> {
    const entretien = await this.entretienRepository.findOne({ where: { id } });

    if (!entretien) {
      return {
        success: false,
        message: `❌ Entretien avec l'ID ${id} non trouvé`,
      };
    }

    entretien.estRealise = true;
    entretien.dateRealisee = dateRealisee;
    
    if (kilometrageRealise !== undefined) {
      entretien.kilometrageRealise = kilometrageRealise;
    }
    
    if (cout !== undefined) {
      entretien.cout = cout;
    }

    const updated = await this.entretienRepository.save(entretien);

    return {
      success: true,
      message: '✅ Entretien marqué comme réalisé !',
      data: updated,
    };
  }

  /**
   * Supprimer un entretien
   */
  async remove(id: number): Promise<any> {
    const entretien = await this.entretienRepository.findOne({ where: { id } });

    if (!entretien) {
      return {
        success: false,
        message: `❌ Entretien avec l'ID ${id} non trouvé`,
      };
    }

    await this.entretienRepository.remove(entretien);

    return {
      success: true,
      message: '✅ Entretien supprimé avec succès !',
      deletedId: id,
    };
  }

  /**
   * Obtenir les statistiques des entretiens
   */
  async getStatistiques(): Promise<any> {
    const total = await this.entretienRepository.count();
    const realises = await this.entretienRepository.count({ where: { estRealise: true } });
    const aVenir = await this.entretienRepository.count({ where: { estRealise: false } });

    // Calculer le coût total des entretiens réalisés
    const entretiensRealises = await this.entretienRepository.find({
      where: { estRealise: true },
    });

    const coutTotal = entretiensRealises.reduce((sum, e) => sum + (Number(e.cout) || 0), 0);

    return {
      success: true,
      message: '📊 Statistiques des entretiens',
      data: {
        total,
        realises,
        aVenir,
        coutTotal: coutTotal.toFixed(2),
        tauxRealisation: total > 0 ? ((realises / total) * 100).toFixed(2) + '%' : '0%',
      },
    };
  }
}