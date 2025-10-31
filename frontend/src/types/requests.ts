// Unified request system types and utilities
export interface InventoryItem {
  id: string;
  location: string;
  address: string;
  product: string;
  category: string;
  available: number;
  unit: string;
  minStock: number;
  lastUpdated: string;
  requestedQuantity?: number;
}

// Article in a request
export interface RequestArticle {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  approvedQuantity?: number;
  location?: string; // Which warehouse the item comes from
}

// History entry for request tracking
export interface RequestHistory {
  id: string;
  timestamp: string;
  action: string;
  comment: string;
  articles: RequestArticle[];
  user: string;
}

// Unified request interface (works for both chairman and employee views)
export interface UnifiedRequest {
  id: string;
  // Basic info
  requestedBy: string;
  organisation: string;
  priority: 'Niedrig' | 'Mittel' | 'Hoch' | 'Kritisch';
  status: 'Offen' | 'Akzeptiert' | 'Abgelehnt' | 'Teilweise genehmigt';
  requestDate: string;
  deadline: string;
  notes: string;
  
  // Articles requested
  articles: RequestArticle[];
  
  // History tracking
  history: RequestHistory[];
  
  // Pickup information (when approved)
  pickupLocation?: string;
  pickupDate?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  instructions?: string;
}

// Utility functions for data conversion
export class RequestUtils {
  private static requestCounter = 1;

  // Generate unique request ID
  static generateRequestId(): string {
    const id = `REQ-${String(this.requestCounter).padStart(3, '0')}`;
    this.requestCounter++;
    return id;
  }

  // Convert cart items to request articles
  static cartItemsToArticles(cartItems: InventoryItem[]): RequestArticle[] {
    return cartItems.map(item => ({
      id: `ART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: item.product,
      quantity: item.requestedQuantity || 1,
      unit: item.unit,
      status: 'Pending' as const,
      location: item.location,
    }));
  }

  // Create new request from cart submission
  static createRequestFromCart(
    cartItems: InventoryItem[],
    requestData: {
      priority: string;
      deadline: string;
      notes: string;
      requestedBy: string;
      organisation: string;
    }
  ): UnifiedRequest {
    const requestId = this.generateRequestId();
    const now = new Date().toISOString();
    
    return {
      id: requestId,
      requestedBy: requestData.requestedBy,
      organisation: requestData.organisation,
      priority: requestData.priority as any,
      status: 'Offen',
      requestDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      deadline: requestData.deadline,
      notes: requestData.notes,
      articles: this.cartItemsToArticles(cartItems),
      history: [
        {
          id: `HIST-${Date.now()}`,
          timestamp: now,
          action: 'Anfrage erstellt',
          comment: `Neue Anfrage mit ${cartItems.length} Artikel(n) eingereicht.`,
          articles: this.cartItemsToArticles(cartItems),
          user: requestData.requestedBy,
        }
      ],
    };
  }

  // Convert UnifiedRequest to legacy RequestType format (for chairman view)
  static toLegacyRequestType(request: UnifiedRequest): any {
    return {
      id: request.id,
      organisation: request.organisation,
      requestedBy: request.requestedBy,
      priority: request.priority,
      status: request.status,
      requestDate: request.requestDate,
      notes: request.notes,
      deadline: request.deadline,
      articles: request.articles.map(article => ({
        id: article.id,
        name: article.name,
        quantity: article.quantity,
        unit: article.unit,
        status: article.status,
      })),
      history: request.history,
    };
  }

  // Convert UnifiedRequest to legacy RequestedItemType format (for employee view)
  static toLegacyRequestedType(request: UnifiedRequest): any {
    return {
      id: request.id,
      priority: request.priority,
      status: request.status === 'Offen' ? 'Ausstehend' : 
             request.status === 'Akzeptiert' ? 'Genehmigt' :
             request.status === 'Abgelehnt' ? 'Abgelehnt' : 'Teilweise genehmigt',
      requestDate: request.requestDate,
      deadline: request.deadline,
      notes: request.notes,
      articles: request.articles.map(article => ({
        id: article.id,
        name: article.name,
        quantity: article.quantity,
        unit: article.unit,
        status: article.status === 'Pending' ? 'Ausstehend' :
               article.status === 'Accepted' ? 'Genehmigt' : 'Abgelehnt',
        approvedQuantity: article.approvedQuantity,
      })),
      history: request.history,
      pickupLocation: request.pickupLocation,
      pickupDate: request.pickupDate,
      contactPerson: request.contactPerson,
      contactPhone: request.contactPhone,
      contactEmail: request.contactEmail,
      instructions: request.instructions,
    };
  }

  // Update request status and add history entry
  static updateRequestStatus(
    request: UnifiedRequest,
    newStatus: UnifiedRequest['status'],
    comment: string,
    user: string,
    articleUpdates?: { [articleId: string]: { status: RequestArticle['status']; approvedQuantity?: number } }
  ): UnifiedRequest {
    const updatedArticles = request.articles.map(article => {
      const update = articleUpdates?.[article.id];
      if (update) {
        return {
          ...article,
          status: update.status,
          approvedQuantity: update.approvedQuantity,
        };
      }
      // If no specific update, set all to match request status
      return {
        ...article,
        status: newStatus === 'Akzeptiert' ? 'Accepted' : 
               newStatus === 'Abgelehnt' ? 'Rejected' : article.status,
        approvedQuantity: newStatus === 'Akzeptiert' ? article.quantity : undefined,
      };
    });

    const historyEntry: RequestHistory = {
      id: `HIST-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: `Anfrage ${newStatus.toLowerCase()}`,
      comment,
      articles: updatedArticles,
      user,
    };

    return {
      ...request,
      status: newStatus,
      articles: updatedArticles,
      history: [...request.history, historyEntry],
    };
  }

  // Initialize request counter from existing requests
  static initializeCounter(existingRequests: UnifiedRequest[]) {
    if (existingRequests.length > 0) {
      const maxId = Math.max(...existingRequests.map(req => {
        const match = req.id.match(/REQ-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      }));
      this.requestCounter = maxId + 1;
    }
  }
}