# 
# makefile para a compilação do documento
#
# Sáb Jun 23 21:13:37 BRT 2007
#

BASE_NAME = qualificacao

LATEX     = latex
PDFLATEX  = pdflatex
BIBTEX    = bibtex
MAKEINDEX = makeindex

open: pdf
	open $(BASE_NAME).pdf

pdf: $(BASE_NAME).pdf
ps: $(BASE_NAME).ps

$(BASE_NAME).pdf: $(BASE_NAME).tex 
	$(PDFLATEX) $<
	$(BIBTEX) $(BASE_NAME) 
	$(MAKEINDEX) $(BASE_NAME) 
	$(PDFLATEX) $< 
	$(PDFLATEX) $<

$(BASE_NAME).ps: $(BASE_NAME).tex 
	$(LATEX) $<
	$(BIBTEX) $(BASE_NAME) 
	$(MAKEINDEX) $(BASE_NAME) 
	$(LATEX) $< 
	$(LATEX) $<
	
clean:
	rm -f $(BASE_NAME)*.ps $(BASE_NAME)*.dvi *.log \
	      *.aux *.blg *.toc \
	      missfont.log $(BASE_NAME)*.bbl $(BASE_NAME)*.pdf $(BASE_NAME)*.out \
		  $(BASE_NAME)*.lof $(BASE_NAME)*.lot $(BASE_NAME).idx $(BASE_NAME).brf $(BASE_NAME).ilg $(BASE_NAME).ind
