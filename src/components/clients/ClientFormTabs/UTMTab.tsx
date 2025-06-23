
import React from 'react';
import ClientUTMData from '../ClientUTMData';

interface UTMTabProps {
  contactId?: string;
}

const UTMTab: React.FC<UTMTabProps> = ({ contactId }) => {
  if (!contactId) {
    return (
      <div className="text-center py-8 text-gray-500">
        <h3 className="text-lg font-medium mb-2">Dados UTM</h3>
        <p>Os dados UTM estarão disponíveis após salvar o cliente.</p>
      </div>
    );
  }

  return <ClientUTMData contactId={contactId} />;
};

export default UTMTab;
