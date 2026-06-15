# Shishir Dutta Portfolio — Premium Text-First Update

This version applies the latest requested changes:

- Removed the **Visual Archive** section shown in the screenshot.
- Removed image boards from **Writing Projects**, **Internships**, **Other Activities**, and **Recognitions**.
- Rebuilt those sections as polished text-led cards, timelines and evidence blocks.
- Removed unused `page-*.webp` visual-board assets from the package.
- Preserved project images only where they still make sense: Graphics Projects and Academic Projects.
- Kept active contact buttons for Facebook, LinkedIn, Behance, Upwork and WhatsApp; the poem link remains within Writing Projects.
- Unified all contact buttons with the same visual treatment; the Website option remains removed.

## Run locally

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Latest writing section update
- Replaced the previous text-led writing explanation with a direct `Writing Projects` headline.
- Added two writing-section image cards using the supplied files:
  - Certificate of Appreciations
  - Published Poem & Story
- Kept the published work link as a compact call-to-action and removed the extra descriptive paragraph.

- Updated the **Internship** section into logo-led premium cards for BioPC, YSSE, and CodeAlpha.

## Other Activities and Recognition update
- Removed the descriptive subheading from **Other Activities**.
- Updated **Social Activity** with the “Waste for Hope” project and “Nistobdotar Hasi” social work.
- Renamed the Recognition heading to **Certification and Achievement**.
- Removed the previous recognition description, evidence cards, and category counters.
- Added two responsive, list-ready subsections: **Certifications** and **Achievements**.

## Latest interface updates

- Unified section-heading typography and alignment.
- Added subtle animated decorative graphics with reduced-motion support.
- Added a floating back-to-top arrow and repaired the brand/home navigation action.
- Replaced the YSSE internship logo with the supplied Stage of Innovation artwork.
- Added a direct WhatsApp link for `+880 1518-318389`.


## Portfolio assistant and publication update

- Added a floating **Shishir Portfolio Assistant** with suggested questions and a responsive chat interface.
- The assistant runs entirely in the visitor's browser and does not expose or require an AI API key.
- Its approved information is stored in `assistant-data.js`; update that file whenever profile, project, certification, achievement, publication, or contact information changes.
- Added the complete publication author list and highlighted Shishir Dutta in the author sequence.
- The assistant identifies Shishir Dutta as the third author based on the supplied author order.

### Updating assistant information

Open `assistant-data.js` and edit the relevant arrays or text fields. Keep the file name unchanged so `index.html` can load it before `script.js`.

## Contact links update

- Added the supplied Facebook and LinkedIn profile links to the Contact section.
- Added both links to the structured person metadata and the portfolio assistant knowledge base.
- Standardized every contact option to the same color and hover treatment.
