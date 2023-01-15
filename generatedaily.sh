BASEDIR=$(dirname "$0")
python3 ${BASEDIR}/scripts/polygon.py ${BASEDIR}/resources ${BASEDIR}/today ${BASEDIR}/previous
python3 ${BASEDIR}/scripts/redactus.py ${BASEDIR}/resources ${BASEDIR}/today ${BASEDIR}/previous