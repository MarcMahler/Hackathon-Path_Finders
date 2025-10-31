import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UnifiedRequest, RequestUtils, InventoryItem } from '../types/requests';

// Context interface
interface RequestContextType {
  // State
  requests: UnifiedRequest[];
  
  // Actions
  addRequest: (
    cartItems: InventoryItem[],
    requestData: {
      priority: string;
      deadline: string;
      notes: string;
      requestedBy: string;
      organisation: string;
    }
  ) => UnifiedRequest;
  
  updateRequestStatus: (
    requestId: string,
    newStatus: UnifiedRequest['status'],
    comment: string,
    user: string,
    articleUpdates?: { [articleId: string]: { status: any; approvedQuantity?: number } }
  ) => void;
  
  getRequestById: (id: string) => UnifiedRequest | undefined;
  
  // View-specific getters
  getRequestsForChairman: () => any[]; // Returns legacy RequestType format
  getRequestsForEmployee: () => any[]; // Returns legacy RequestedItemType format
  
  // Statistics
  getOpenRequestsCount: () => number;
  getRequestCountsByStatus: () => {
    pending: number;
    approved: number;
    rejected: number;
    partial: number;
  };
}

// Create context
const RequestContext = createContext<RequestContextType | undefined>(undefined);

// Hook to use the context
export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};

// Provider component
interface RequestProviderProps {
  children: ReactNode;
}

export const RequestProvider = ({ children }: RequestProviderProps) => {
  const [requests, setRequests] = useState<UnifiedRequest[]>([]);

  // Load requests from localStorage on mount
  useEffect(() => {
    const savedRequests = localStorage.getItem('resilio-requests');
    if (savedRequests) {
      try {
        const parsed = JSON.parse(savedRequests) as UnifiedRequest[];
        setRequests(parsed);
        // Initialize the counter based on existing requests
        RequestUtils.initializeCounter(parsed);
      } catch (error) {
        console.error('Error loading requests from localStorage:', error);
      }
    }
  }, []);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('resilio-requests', JSON.stringify(requests));
  }, [requests]);

  // Add new request from cart
  const addRequest = (
    cartItems: InventoryItem[],
    requestData: {
      priority: string;
      deadline: string;
      notes: string;
      requestedBy: string;
      organisation: string;
    }
  ): UnifiedRequest => {
    const newRequest = RequestUtils.createRequestFromCart(cartItems, requestData);
    
    setRequests(prev => [...prev, newRequest]);
    
    return newRequest;
  };

  // Update request status
  const updateRequestStatus = async (
    requestId: string,
    newStatus: UnifiedRequest['status'],
    comment: string,
    user: string,
    articleUpdates?: { [articleId: string]: { status: any; approvedQuantity?: number } }
  ) => {
    // Update the request status first
    setRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return RequestUtils.updateRequestStatus(request, newStatus, comment, user, articleUpdates);
      }
      return request;
    }));

    // Request status updated successfully (inventory updates removed per user request)
  };

  // Get specific request by ID
  const getRequestById = (id: string): UnifiedRequest | undefined => {
    return requests.find(request => request.id === id);
  };

  // Get requests for chairman view (legacy format)
  const getRequestsForChairman = () => {
    return requests.map(request => RequestUtils.toLegacyRequestType(request));
  };

  // Get requests for employee view (legacy format)
  const getRequestsForEmployee = () => {
    return requests.map(request => RequestUtils.toLegacyRequestedType(request));
  };

  // Get count of open requests for sidebar badge
  const getOpenRequestsCount = (): number => {
    return requests.filter(request => request.status === 'Offen').length;
  };

  // Get request counts by status for employee dashboard
  const getRequestCountsByStatus = () => {
    return {
      pending: requests.filter(req => req.status === 'Offen').length,
      approved: requests.filter(req => req.status === 'Akzeptiert').length,
      rejected: requests.filter(req => req.status === 'Abgelehnt').length,
      partial: requests.filter(req => req.status === 'Teilweise genehmigt').length,
    };
  };

  const contextValue: RequestContextType = {
    requests,
    addRequest,
    updateRequestStatus,
    getRequestById,
    getRequestsForChairman,
    getRequestsForEmployee,
    getOpenRequestsCount,
    getRequestCountsByStatus,
  };

  return (
    <RequestContext.Provider value={contextValue}>
      {children}
    </RequestContext.Provider>
  );
};

// Export the context for testing purposes
export { RequestContext };