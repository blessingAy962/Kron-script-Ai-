// Central setting for controlling the maintenance notice on affected tools.
// If a tool's flag is set to true, it will display the gorgeous branded maintenance notice.
export const MAINTENANCE_CONFIG = {
  globalMaintenance: false,
  tools: {
    promptMaker: false,     // Prompt Maker in Creator Toolkit
    movieScript: false,     // Movie Script / Blockbuster Workspace
    images: false,          // AI Image Studio
    video: false,           // Video tools in Creator Toolkit
    thumbnail: false,       // Thumbnail analyzer in Creator Toolkit
    captions: false,        // Captions in Creator Toolkit
    detector: false,        // AI Pacing & Safe-zone in Creator Toolkit
  }
};
