export function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        currentUser: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        services: [],
        quotes: [],
        supplies: [],
        supplyOffers: [],
      };

    case 'SET_SERVICES':
      return {
        ...state,
        services: action.payload,
      };

    case 'SET_QUOTES':
      return {
        ...state,
        quotes: action.payload,
      };

    case 'SET_SUPPLIES':
      return {
        ...state,
        supplies: action.payload,
      };

    case 'SET_SUPPLY_OFFERS':
      return {
        ...state,
        supplyOffers: action.payload,
      };

    case 'ADD_SERVICE':
      return {
        ...state,
        services: [...state.services, action.payload],
      };

    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload } : s
        ),
      };

    case 'ADD_QUOTE':
      return {
        ...state,
        quotes: [...state.quotes, action.payload],
      };

    case 'UPDATE_QUOTE':
      return {
        ...state,
        quotes: state.quotes.map((q) =>
          q.id === action.payload.id ? { ...q, ...action.payload } : q
        ),
      };

    case 'ADD_SUPPLY':
      return {
        ...state,
        supplies: [...state.supplies, action.payload],
      };

    case 'UPDATE_SUPPLY':
      return {
        ...state,
        supplies: state.supplies.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload } : s
        ),
      };

    case 'DELETE_SUPPLY':
      return {
        ...state,
        supplies: state.supplies.filter((s) => s.id !== action.payload),
      };

    case 'ADD_SUPPLY_OFFER':
      return {
        ...state,
        supplyOffers: [...state.supplyOffers, action.payload],
      };

    case 'UPDATE_SUPPLY_OFFER':
      return {
        ...state,
        supplyOffers: state.supplyOffers.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      };

    case 'DELETE_SUPPLY_OFFER':
      return {
        ...state,
        supplyOffers: state.supplyOffers.filter((p) => p.id !== action.payload),
      };

    case 'SELECT_QUOTE':
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === action.payload.serviceId
            ? { ...s, cotizacionSeleccionadaId: action.payload.quoteId, estado: 'ASIGNADO' }
            : s
        ),
      };

    default:
      return state;
  }
}

