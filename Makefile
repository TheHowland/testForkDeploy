.PHONY: install
install:
	#python3 setup.py install
	pip3 install .

.PHONY: package
package:
	python3 setup.py sdist bdist_wheel

lcapy/exprclasses.py: lcapy/makeclasses.py lcapy/domains.py lcapy/quantities.py
	cd lcapy; python3 makeclasses.py


.PHONY: upload-test
upload-test: package
	python3 -m twine upload --repository-url https://test.pypi.org/legacy/ dist/*

.PHONY: upload
upload: package
	python3 -m twine upload dist/*

.PHONY: test
test: lcapy/*.py
	nosetests -s --pdb

.PHONY: cover
cover: lcapy/*.py
	nosetests --pdb --with-coverage --cover-package=lcapy --cover-html

.PHONY: doc
release: doc push
	cd /tmp; rm -rf lcapy; git clone git@github.com:mph-/lcapy.git; cd lcapy; make test; make upload

.PHONY: release-test
release-test: doc push
	cd /tmp; rm -rf lcapy; git clone git@github.com:mph-/lcapy.git; cd lcapy; make test

.PHONY: style-check
style-check:
	flake8 lcapy
	flake8 doc

.PHONY: flake8
flake8:
	flake8 lcapy
	flake8 doc

.PHONY: check
check: style-check test

.PHONY: push
push: check
	git push
	git push --tags

.PHONY: doc
doc:
	cd doc; make html

.PHONY: clean
clean:
	-rm -rf build lcapy.egg-info dist
	cd doc; make clean
