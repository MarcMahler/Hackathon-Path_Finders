// Debugging helper to inspect localStorage requests
console.log('=== Resilio Request Debug ===');

const savedRequests = localStorage.getItem('resilio-requests');
if (savedRequests) {
  try {
    const requests = JSON.parse(savedRequests);
    console.log(`Found ${requests.length} requests in localStorage:`);
    requests.forEach((req, index) => {
      console.log(`${index + 1}. ${req.id} - ${req.status} - ${req.articles.length} articles`);
      console.log(`   Priority: ${req.priority}, Deadline: ${req.deadline}`);
      console.log(`   Articles:`, req.articles.map(a => `${a.name} (${a.quantity}x)`));
    });
  } catch (error) {
    console.error('Error parsing requests:', error);
  }
} else {
  console.log('No requests found in localStorage');
}

// Helper to clear requests for testing
window.clearRequests = () => {
  localStorage.removeItem('resilio-requests');
  console.log('Requests cleared!');
  window.location.reload();
};

console.log('Use clearRequests() to reset for testing');