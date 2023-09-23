pipeline {
    agent none
    parameters {
        string(defaultValue: '$BUILD_NUMBER', description: '', name: 'VERSION', trim: true)
        choice(name: 'DEPLOYMENT_DESTINATION', choices: ['develop', 'test', 'release', 'coredevops-server'], description: '')
        choice(name: 'PRE_BUILD_UI', choices: ['No', 'Yes'], description: '')
    }
    environment {
      ORG_GRADLE_PROJECT_git_version = "${VERSION}"
      ORG_GRADLE_PROJECT_build_number = "${GIT_COMMIT}"
    }
    tools {
        jdk 'jdk1.7'
        gradle 'gradle2.2.1'
        groovy 'groovy4'
    }
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node10:latest'
                    label 'builder'
                    args '--add-host coredevops.samat.ir:192.168.30.30  --add-host coredevops.samat.ir:192.168.30.30'
                }
            }
            steps {
                ansiColor('xterm') {
                    echo "this is Build Number : ${BUILD_NUMBER}"
                    echo "this is version number: ${VERSION}"
                    echo "this is git number: ${GIT_COMMIT}"
                    sh label: '', script: '''#!/bin/bash
                    if [ "${PRE_BUILD_UI}" == "Yes" ]; then
                        if [ -f *-ui/bower.json ]; then
                          echo "UI project is Angular"
                          cd *-ui/ ; rm -rf bower_components node_modules package-lock.json ; npm install ; bower install ; gulp build
                        else
                          echo "UI project is React"
                          cd *-ui/ ; rm -rf node_modules package-lock.json ; npm install ; npm run build
                        fi
                    fi
                    '''
                    sh "/opt/gradle/gradle-2.2.1/bin/gradle --no-daemon clean stage"
                }
            }
        }
        stage('Deploy') {
            agent {
              label 'ansible'
            }
            steps {
                ansiColor('xterm') {
                    echo "this is Build Number : ${BUILD_NUMBER}"
                    sh label: '', script: '''#!/bin/bash -l
File="ansible/roles.txt"
Roles="ansible/install_roles.yml"
Params="ansible/param.json"
has_db=false
>$Roles
>$Params
if [ ! -f $File  ]; then
        echo "$File : does not exists "
        exit 1
elif [ ! -r $File  ]; then
        echo "$File : can not read "
        exit 1
elif [ ! -s $File ]; then
        echo "File empty"
        exit 1
fi
lines=`cat $File`
for line in $lines; do
        echo "- src: http://192.168.30.30:10680/repository/test/ansible-roles/$line/1.0.0/$line-1.0.0-role.tar/$line/1.0.0/$line-1.0.0-role.tar" >> $Roles
        echo "  name: $line" >> $Roles
        if [ "$line" == "app-db" ] ; then
                echo "{\\"db_version\\":\\"${VERSION}\\", \\"app_version\\":\\"${VERSION}\\"}" > $Params
                has_db=true
        fi
if [ ! has_db ]; then
                echo "{\\"app_version\\":\\"${VERSION}\\"}" > $Params
fi
done
rm -rf ansible/roles/*'''
                    sh label: '', script: '''wget http://192.168.30.30:10680/repository/test/ansible-hosts/${DEPLOYMENT_DESTINATION}/1.0.0/${DEPLOYMENT_DESTINATION}-1.0.0-inventory.tar
tar -xf ${DEPLOYMENT_DESTINATION}-1.0.0-inventory.tar -C ansible/
ansible-galaxy install -r ansible/install_roles.yml -p ansible/roles
(cd ansible ; ANSIBLE_FORCE_COLOR=true ansible-playbook app-deploy.yml -i ${DEPLOYMENT_DESTINATION}/${DEPLOYMENT_DESTINATION}  --extra-vars @param.json )'''
                }
            }
        }
    }
}
