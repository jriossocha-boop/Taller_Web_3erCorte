const BASE_URL = 'https://www.dnd5eapi.co/api';

let globalEquipmentCache = null;
let equipmentPromise = null;

export const fetchMonsters = async () => {
  try {
    const response = await fetch(`${BASE_URL}/monsters`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching monsters:', error);
    return [];
  }
};

export const fetchMonsterDetails = async (index) => {
  try {
    const response = await fetch(`${BASE_URL}/monsters/${index}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching monster details:', error);
    return null;
  }
};

export const fetchEquipment = async () => {
  try {
    const response = await fetch(`${BASE_URL}/equipment`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return [];
  }
};

export const fetchItemDetails = async (url) => {
  try {
    const response = await fetch(`https://www.dnd5eapi.co${url}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching item details:', error);
    return null;
  }
};

export const fetchEquipmentDetails = fetchItemDetails;

export const fetchMagicItems = async () => {
  try {
    const response = await fetch(`${BASE_URL}/magic-items`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching magic items:', error);
    return [];
  }
};

export const getCachedDetailedEquipment = async () => {
  // Verificamos que la caché tenga elementos reales (mayor a 0), de lo contrario permite reintentar
  if (globalEquipmentCache?.length) return globalEquipmentCache;
  if (equipmentPromise) return equipmentPromise;

  equipmentPromise = (async () => {
    try {
      const eq = await fetchEquipment();
      if (!eq || eq.length === 0) {
        equipmentPromise = null;
        return [];
      }

      const detailedPromises = eq.map(async (item) => {
        const details = await fetchItemDetails(item.url);
        if (!details) return null;

        let costInGp = 0;
        if (details && details.cost) {
          const q = details.cost.quantity || 0;
          const unit = details.cost.unit || 'gp';
          if (unit === 'cp') costInGp = q / 100;
          else if (unit === 'sp') costInGp = q / 10;
          else if (unit === 'gp') costInGp = q;
          else if (unit === 'pp') costInGp = q * 10;
        }
        return { item, details, costInGp };
      });

      const results = await Promise.all(detailedPromises);
      const validResults = results.filter(item => item !== null);

      // Solo guardamos en la caché si realmente obtuvimos resultados válidos
      if (validResults.length > 0) {
        globalEquipmentCache = validResults;
      } else {
        equipmentPromise = null;
      }

      return globalEquipmentCache || [];
    } catch (error) {
      console.error('Error en la precarga global de equipo, reintentando...', error);
      equipmentPromise = null;
      return [];
    }
  })();

  return equipmentPromise;
};