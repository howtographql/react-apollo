for /F %%i in ("%cd%") do set PROJ_NAME=%%~ni
echo %PROJ_NAME%