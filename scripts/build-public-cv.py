#!/usr/bin/env python3
"""Build the telephone-free public CV PDF."""

from __future__ import annotations

import re
from pathlib import Path
from typing import Iterable

from pypdf import PdfReader
from reportlab import rl_config
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "files" / "Jialin_Tang_CV.pdf"

PAGE_WIDTH, PAGE_HEIGHT = LETTER
PAGE_MARGIN = 0.40 * inch
LEFT_MARGIN = PAGE_MARGIN
RIGHT_MARGIN = PAGE_MARGIN
TOP_MARGIN = PAGE_MARGIN
BOTTOM_MARGIN = PAGE_MARGIN
CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
CONTENT_INSET = 0.16 * inch

INK = colors.black
MUTED = colors.HexColor("#222222")
RULE = colors.black

rl_config.useA85 = 0


EDUCATION = [
    {
        "institution": "University of California, Irvine",
        "degree": "Ph.D. in Computational Science",
        "date": "Expected 2030",
    },
    {
        "institution": "California State University, Fullerton",
        "degree": "M.S. in Computer Science",
        "date": "2026",
    },
    {
        "institution": "Shandong University of Finance and Economics",
        "degree": "B.M. in Information Management and Information Systems",
        "date": "2022",
    },
]

RESEARCH_INTERESTS = [
    "Deep learning",
    "image processing",
    "Vision Large Language Models",
    "diffusion",
]

JOURNAL_ARTICLES = [
    {
        "authors": "<b>J. Tang</b>, Y. Lou, Y. Guo, and Y. Bai",
        "title": (
            "HyperMODE: A Continuous-Depth Spectral-Spatial Modeling Framework "
            "With Mamba and Neural Ordinary Differential Equations for "
            "Hyperspectral Image Classification"
        ),
        "venue": (
            "<i>IEEE Journal of Selected Topics in Applied Earth Observations "
            "and Remote Sensing</i>, vol. 19, pp. 21474-21491, 2026"
        ),
    },
    {
        "authors": "<b>J. Tang</b>, N. Ma, C. Jia, R. Tian, and Y. Guo",
        "title": (
            "HyperEAST: An Enhanced Attention-Based Spectral-Spatial Transformer "
            "With Self-Supervised Pretraining for Hyperspectral Image Classification"
        ),
        "venue": (
            "<i>IEEE Journal of Selected Topics in Applied Earth Observations "
            "and Remote Sensing</i>, vol. 18, pp. 22241-22255, 2025"
        ),
    },
    {
        "authors": "<b>J. Tang</b>, Y. Yang, R. He, and Y. Bai",
        "title": (
            "Multimodal Mammography-Radiomics Fusion for Breast-Side-Level "
            "Prediction of Lymph Node Metastasis in Breast Cancer"
        ),
        "venue": (
            "manuscript in final preparation for submission to "
            "<i>npj Precision Oncology</i>"
        ),
    },
    {
        "authors": (
            "Y. Yang<super>*</super>, <b>J. Tang<super>*</super></b>, Y. Bai, "
            "J. Luo, S. Cao, and R. He"
        ),
        "title": (
            "Identification of Dynamic Network Biomarkers in Hepatitis B-Related "
            "Hepatocellular Carcinoma Progression Using Cross-Sectional Multimodal "
            "Metabolomics Analysis With Transformer and ODE Models"
        ),
        "venue": (
            "manuscript in final preparation for submission to "
            "<i>Nature Machine Intelligence</i>, 2026"
        ),
    },
]

CONFERENCE_PAPERS = [
    {
        "authors": "<b>J. Tang</b> and Y. Bai",
        "title": (
            "PRISM-MAP: Pathology-Relevant Inversion with Semantic-Frequency "
            "Modulation and Morphology-Aligned Projection for Unpaired Virtual Staining"
        ),
        "venue": (
            "submitted to the <i>AAAI Conference on Artificial Intelligence "
            "(AAAI 2027)</i>"
        ),
    },
    {
        "authors": "<b>J. Tang</b> and Y. Bai",
        "title": (
            "MAS-LLaVA: Motion-Aware Adaptive Sampling for Training-Free Video "
            "Large Language Models"
        ),
        "venue": (
            "<i>2026 International Conference on Artificial Intelligence, Computer, "
            "Data Sciences and Applications (ACDSA)</i>"
        ),
    },
    {
        "authors": "A. George, Y. Bai, and <b>J. Tang</b>",
        "title": (
            "Regression-Based Modeling of Antisense Oligonucleotide Efficacy "
            "Using Sequence, Structural, and Off-Target Features"
        ),
        "venue": (
            "<i>2026 IEEE 16th Annual Computing and Communication Workshop and "
            "Conference (CCWC)</i>, Las Vegas, NV, USA, 2026, pp. 458-461"
        ),
    },
    {
        "authors": "A. George and <b>J. Tang</b>",
        "title": (
            "Optimizing Energy Management Strategy for EV Wireless Charging "
            "Efficiency Using Proximal Policy Optimization"
        ),
        "venue": (
            "<i>2026 IEEE 16th Annual Computing and Communication Workshop and "
            "Conference (CCWC)</i>, Las Vegas, NV, USA, 2026, pp. 454-457"
        ),
    },
]

SERVICE = [
    (
        "Reviewer for the Conference on Neural Information Processing Systems "
        "(NeurIPS) 2026."
    ),
    "Reviewer for the Conference on Artificial Intelligence (AAAI) 2027.",
]


class InvariantCanvas(Canvas):
    """Create byte-stable PDFs by suppressing timestamps and random document IDs."""

    def __init__(self, *args, **kwargs):
        kwargs["invariant"] = 1
        super().__init__(*args, **kwargs)


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "CVName",
            parent=base["Title"],
            fontName="Times-Bold",
            fontSize=24,
            leading=27,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=2,
        ),
        "contact": ParagraphStyle(
            "CVContact",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=9.6,
            leading=11.5,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
        "section": ParagraphStyle(
            "CVSection",
            parent=base["Heading2"],
            fontName="Times-Bold",
            fontSize=11,
            leading=13,
            textColor=INK,
            keepWithNext=True,
        ),
        "institution": ParagraphStyle(
            "CVInstitution",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=9.8,
            leading=11.8,
            textColor=INK,
        ),
        "degree": ParagraphStyle(
            "CVDegree",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=9.5,
            leading=11.5,
            textColor=INK,
        ),
        "date": ParagraphStyle(
            "CVDate",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=9.6,
            leading=11.8,
            textColor=INK,
            alignment=TA_RIGHT,
        ),
        "body": ParagraphStyle(
            "CVBody",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=9.6,
            leading=12,
            textColor=INK,
            alignment=TA_LEFT,
            leftIndent=CONTENT_INSET,
        ),
        "entry": ParagraphStyle(
            "CVEntry",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=9.4,
            leading=11.7,
            textColor=INK,
            alignment=TA_LEFT,
        ),
        "number": ParagraphStyle(
            "CVNumber",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=9.4,
            leading=11.7,
            textColor=INK,
            alignment=TA_RIGHT,
        ),
    }


def section_heading(title: str) -> Table:
    heading = Paragraph(title.upper(), STYLES["section"])
    table = Table([[heading]], colWidths=[CONTENT_WIDTH])
    table.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
                ("LINEBELOW", (0, 0), (-1, -1), 0.55, RULE),
            ]
        )
    )
    table.spaceBefore = 6.5
    table.spaceAfter = 3.5
    return table


def education_table() -> Table:
    rows = []
    for item in EDUCATION:
        left = Paragraph(
            f"{item['institution']}<br/><font name='Times-Roman'>{item['degree']}</font>",
            STYLES["institution"],
        )
        right = Paragraph(item["date"], STYLES["date"])
        rows.append(["", left, right])

    date_width = 1.25 * inch
    table = Table(
        rows,
        colWidths=[
            CONTENT_INSET,
            CONTENT_WIDTH - CONTENT_INSET - date_width,
            date_width,
        ],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def publication_rows(entries: Iterable[dict[str, str]]) -> list[KeepTogether]:
    rows = []
    for number, item in enumerate(entries, start=1):
        citation = Paragraph(
            f"{item['authors']}, <b>{item['title']}</b>, {item['venue']}.",
            STYLES["entry"],
        )
        table = Table(
            [["", Paragraph(f"{number}.", STYLES["number"]), citation]],
            colWidths=[
                CONTENT_INSET,
                0.25 * inch,
                CONTENT_WIDTH - CONTENT_INSET - 0.25 * inch,
            ],
            hAlign="LEFT",
        )
        table.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (1, 0), (1, -1), 4),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ]
            )
        )
        rows.append(KeepTogether([table, Spacer(1, 5.4)]))
    return rows


def service_rows() -> list[KeepTogether]:
    rows = []
    for item in SERVICE:
        rows.append(KeepTogether([Paragraph(item, STYLES["body"]), Spacer(1, 1.5)]))
    return rows


def build_story() -> list:
    location = Paragraph("Irvine, CA", STYLES["contact"])
    contact = Paragraph(
        "<link href='mailto:jialit7@uci.edu' color='#000000'>jialit7@uci.edu</link>"
        " &nbsp;&middot;&nbsp; "
        "<link href='https://jaylentang.github.io/' color='#000000'>"
        "jaylentang.github.io</link>",
        STYLES["contact"],
    )
    header = Table(
        [
            [Paragraph("Jialin Tang", STYLES["name"])],
            [location],
            [contact],
        ],
        colWidths=[CONTENT_WIDTH],
    )
    header.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )

    story = [header, Spacer(1, 1)]
    story.extend([section_heading("Education"), education_table()])
    research_line = (
        f"{', '.join(RESEARCH_INTERESTS[:-1])} and {RESEARCH_INTERESTS[-1]}."
    )
    story.extend(
        [
            section_heading("Research Interests"),
            Paragraph(research_line, STYLES["body"]),
        ]
    )
    story.append(section_heading("Journal Articles"))
    story.extend(publication_rows(JOURNAL_ARTICLES))
    story.append(section_heading("Conference Papers"))
    story.extend(publication_rows(CONFERENCE_PAPERS))
    story.append(section_heading("Service"))
    story.append(Paragraph("<b>Invited Reviewer</b>", STYLES["body"]))
    story.append(Spacer(1, 1.5))
    story.extend(service_rows())
    return story


def build_pdf(output_path: Path = OUTPUT_PATH) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    frame = Frame(
        LEFT_MARGIN,
        BOTTOM_MARGIN,
        PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN,
        PAGE_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="cv-frame",
    )
    template = PageTemplate(id="cv", frames=[frame])
    document = BaseDocTemplate(
        str(output_path),
        pagesize=LETTER,
        leftMargin=LEFT_MARGIN,
        rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN,
        bottomMargin=BOTTOM_MARGIN,
        title="Jialin Tang - Curriculum Vitae",
        author="Jialin Tang",
        subject="Public academic curriculum vitae",
        creator="scripts/build-public-cv.py",
        pageCompression=1,
        pageTemplates=[template],
    )
    document.build(build_story(), canvasmaker=InvariantCanvas)


def verify_pdf(output_path: Path = OUTPUT_PATH) -> tuple[int, str]:
    reader = PdfReader(output_path)
    extracted_text = "\n".join(page.extract_text() or "" for page in reader.pages)

    forbidden_fragments = ("+1 (949)", "949-979", "979-3861")
    for fragment in forbidden_fragments:
        assert fragment not in extracted_text, f"Telephone fragment found: {fragment}"
    assert not re.search(
        r"(?:\+?1[\s.-]*)?\(?\d{3}\)?[\s.-]*\d{3}[\s.-]*\d{4}",
        extracted_text,
    ), "Telephone number found in public CV"

    required_fragments = (
        "Jialin Tang",
        "Irvine, CA",
        "jialit7@uci.edu",
        "jaylentang.github.io",
        "University of California, Irvine",
        "Ph.D. in Computational Science",
        "Expected 2030",
        "California State University, Fullerton",
        "M.S. in Computer Science",
        "Shandong University of Finance and Economics",
        "B.M. in Information Management and Information Systems",
        "Vision Large Language Models",
        "HyperMODE",
        "21474-21491",
        "HyperEAST",
        "22241-22255",
        "Multimodal Mammography-Radiomics Fusion",
        "npj Precision Oncology",
        "Identification of Dynamic Network Biomarkers",
        "Nature Machine Intelligence",
        "PRISM-MAP",
        "AAAI 2027",
        "MAS-LLaVA",
        "Regression-Based Modeling of Antisense Oligonucleotide Efficacy",
        "458-461",
        "Optimizing Energy Management Strategy for EV Wireless Charging",
        "454-457",
        "Conference on Neural Information Processing Systems (NeurIPS) 2026",
        "Reviewer for the Conference on Artificial Intelligence (AAAI) 2027",
    )
    for fragment in required_fragments:
        assert fragment in extracted_text, f"Required content missing: {fragment}"

    links = {
        annotation.get_object().get("/A", {}).get("/URI")
        for page in reader.pages
        for annotation in page.get("/Annots", [])
    }
    assert not any(uri and uri.lower().startswith("tel:") for uri in links)
    required_links = {"mailto:jialit7@uci.edu", "https://jaylentang.github.io/"}
    assert required_links.issubset(links), "Required contact links are not active"
    assert len(reader.pages) == 1, "Public CV must fit on one page"

    return len(reader.pages), extracted_text


STYLES = make_styles()


if __name__ == "__main__":
    build_pdf()
    page_count, _ = verify_pdf()
    print(f"Generated {OUTPUT_PATH} ({page_count} page(s)); verification passed.")
