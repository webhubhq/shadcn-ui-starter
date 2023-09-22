#!/bin/bash

stacks=(
stack-1y47lts7-pt-1
stack-1y47lts7-pt-2
stack-6UdUQUMc-pt-1
stack-6UdUQUMc-pt-2
stack-6WLrwK6k-pt-1
stack-6WLrwK6k-pt-2
stack-CqzsvPx2-pt-1
stack-CqzsvPx2-pt-2
stack-DpooEjKK-pt-1
stack-Lwoq1fQ1-pt-1
stack-Lwoq1fQ1-pt-2
stack-P7ARl-pt-1
stack-P7ARl-pt-2
stack-SxVQgz1U-pt-1
stack-SxVQgz1U-pt-2
stack-TktTkq1G-pt-1
stack-TktTkq1G-pt-2
stack-WO1eHOwh-pt-1
stack-WO1eHOwh-pt-2
stack-bnVc7-pt-1
stack-bnVc7-pt-2
stack-dZKfIl8j-pt-1
stack-dZKfIl8j-pt-2
stack-eZ86Cypa-pt-1
stack-eZ86Cypa-pt-2
stack-fCY0nCaR-pt-1
stack-fCY0nCaR-pt-2
stack-gILK9-pt-1
stack-gILK9-pt-2
stack-gR0Or-pt-1
stack-gR0Or-pt-2
stack-jmfJk-pt-1
stack-jmfJk-pt-2
stack-knLz13Bf-pt-1
stack-knLz13Bf-pt-2
stack-o8VmH-pt-1
stack-o8VmH-pt-2
)


for stack in "${stacks[@]}"; do
    pulumi destroy -s jricramc/crud-test/$stack -y
    if [ $? -ne 0 ]; then
        echo "Error destroying stack $stack"
        exit 1
    fi
done

echo "All stacks destroyed successfully!"