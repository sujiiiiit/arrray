// Example usage
const inputMetadata = {
    text: {
      content: "Analyze this image for defects",
      isProcessed: true
    },
    search: {
      isEnabled: true,
      query: "manufacturing defects"
    },
    image: {
      isPresent: true,
      files: [{
        id: "img-123",
        name: "factory-part.jpg",
        size: 245000,
        type: "image/jpeg",
        thumbnailUrl: "https://example.com/thumbnails/factory-part.jpg",
        publicUrl: "https://example.com/uploads/factory-part.jpg"
      }]
    },
    file: {
      isPresent: false,
      files: []
    },
    project: {
      id: "proj-456",
      name: "Quality Control"
    },
    timestamp: {
      created: new Date().toISOString()
    },
    status: "pending"
  };