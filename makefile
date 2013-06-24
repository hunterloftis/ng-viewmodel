deploy:
	git checkout gh-pages
	git merge -s recursive -X theirs master
	git push github gh-pages
	git checkout master

.PHONY: deploy
