import { defineStore } from "pinia";
import { reactive } from "vue";
import jsPDF from "jspdf";
// import LetterHead from "src/custom_templates/letter_head";
import autoTable from "jspdf-autotable";
import philhealthBanner from "src/custom_templates/philhealth_banner";
import bangonPilipinas from "src/custom_templates/bangon_pilipinas";
import contactInfo from "src/custom_templates/contact_info";

const initialForm = {
  ob_date: "",
  place_visited: "",
  employee_name: "",
  time_of_arrival: "",
  time_of_departure: "",
  person_visited: "",
  signature: null,
  image: null,
};
export const useGenerateAppearanceStore = defineStore(
  "generate_appearance",
  () => {
    const form = reactive({ ...initialForm });
    const doc = new jsPDF({
      orientation: "portrait",
    });

    const generatePdf = () => {
      try {
        const now = new Date().toDateString();
        const signature = form.signature;

        // doc.addImage(LetterHead, 35, 10, 150, 25);
        doc.addImage(philhealthBanner, 15, 15, 30, 15);
        doc.addImage(bangonPilipinas, 50, 15, 18, 13);
        doc.addImage(contactInfo, 110, 10, 85, 30);

        doc.setFont("helvetica", "bold");
        doc.text("CERTIFICATE OF APPEARANCE", 105, 50, null, null, "center");
        doc.setFont("times", "normal");
        doc.text(`Date: ${now}`, 190, 70, null, null, "right");
        doc.text("To whom it may concern:", 20, 80, "left");
        doc.text(
          `This is to certify that ${form.employee_name} went out of the office premises on the following date/s on official business`,
          20,
          90,
          {
            align: "left",
            maxWidth: "170", // default 170
          }
        );
        // CREATE THE TABLE
        autoTable(doc, {
          head: [
            [
              "DATE",
              "TIME OF ARRIVAL",
              "TIME OF DEPARTURE",
              "PERSON AND PLACED VISITED",
              "SIGNATURE",
            ],
          ],
          // FORMAT THE DATE IN THE TABLE BODY
          body: [
            [
              form.ob_date,
              form.time_of_arrival,
              form.time_of_departure,
              `${form.person_visited} - ${form.place_visited}`,
            ],
          ],
          // ATTACH THE SIGNATURE
          didDrawCell: (data) => {
            if (data.section === "body" && data.column.index === 4) {
              doc.addImage(
                signature,
                "JPEG",
                data.cell.x + 2,
                data.cell.y + 2,
                20,
                10
              );
            }
          },
          startY: 120,
        });

        // ID IMAGE
        // doc.addImage(form.image, "JPEG", 50, 160, 100, 60);
        doc.addImage(form.image, "PNG", 50, 160, 120, 100, undefined, "FAST");

        doc.save("certificate_of_appearance.pdf");
      } catch (error) {
        console.error(error);
        throw new Error("Failed to generate PDF!");
      }
    };

    return {
      form,
      generatePdf,
    };
  }
);
